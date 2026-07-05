import { useReducer } from 'react';
import { Button } from '@/components/ui/button';

import { CELL_TYPE } from './lib/CellTypes.js';
import { GENERATIONS } from './lib/Generations.js';
import { computeAllHeatmaps } from './lib/Propagation.js';

import FloorplanEditor from './FloorplanEditor/index.jsx';
import HeatmapViewer from './HeatmapViewer/index.jsx';

// ---------------------------------------------------------------------------
// Grid config — fixed at initialization, never changed at runtime.
// Adjust these to change the floor plan size.
// At 16px per cell: 640 × 480px canvas.
// ---------------------------------------------------------------------------

const GRID_WIDTH  = 40;
const GRID_HEIGHT = 30;
const CELL_SIZE   = 16; // px — passed down to canvas renderers

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

/**
 * @returns {import('./types').State}
 */
function createInitialState() {
    return {
        mode:            'floorplan',
        gridWidth:       GRID_WIDTH,
        gridHeight:      GRID_HEIGHT,
        grid:            new Uint8Array(GRID_WIDTH * GRID_HEIGHT), // all 0 = CELL_TYPE.EMPTY
        router:          { x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2) },
        activeMaterial:  CELL_TYPE.DRYWALL,
        activeGeneration: 0,
        heatmaps:        [],
    };
}

/**
 * @param {import('./types').State} state
 * @param {{ type: string } & Record<string, any>} action
 * @returns {import('./types').State}
 */
function reducer(state, action) {
    switch (action.type) {

        case 'SET_MODE': {
            if (action.mode === state.mode) return state;

            if (action.mode === 'heatmap') {
                // Precompute all generation heatmaps on entry.
                // Computed fresh every time — heatmap cache is never the source of truth.
                const heatmaps = computeAllHeatmaps(
                    state.grid,
                    state.gridWidth,
                    state.gridHeight,
                    state.router,
                    GENERATIONS,
                );
                return { ...state, mode: 'heatmap', heatmaps };
            }

            // Returning to floor plan — discard the cache entirely.
            return { ...state, mode: 'floorplan', heatmaps: [] };
        }

        case 'PAINT_CELL': {
            const { x, y } = action;

            // Guard: don't paint over the router position
            if (x === state.router.x && y === state.router.y) return state;

            const idx = y * state.gridWidth + x;

            // Guard: no-op if cell already has the active material
            if (state.grid[idx] === state.activeMaterial) return state;

            // Uint8Array copy is O(n) but fine for a 40×30 = 1200-cell grid.
            // If the grid grows significantly, consider a copy-on-write scheme.
            const newGrid = state.grid.slice();
            newGrid[idx]  = state.activeMaterial;
            return { ...state, grid: newGrid };
        }

        case 'SET_MATERIAL': {
            return { ...state, activeMaterial: action.material };
        }

        case 'MOVE_ROUTER': {
            const { x, y } = action;

            // Guard: router cannot be placed on any wall cell
            const cellType = state.grid[y * state.gridWidth + x];
            if (cellType !== CELL_TYPE.EMPTY) return state;

            return { ...state, router: { x, y } };
        }

        case 'SET_GENERATION': {
            return { ...state, activeGeneration: action.index };
        }

        default:
            return state;
    }
}

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------

export default function WifiHeatmapExplorer() {
    const [state, dispatch] = useReducer(reducer, null, createInitialState);

    const isHeatmap = state.mode === 'heatmap';

    return (
        <div className="wifi-explorer flex flex-col gap-4 w-fit">

            {/* Mode toggle */}
            <div className="flex items-center gap-2">
                <Button
                    variant={isHeatmap ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => dispatch({ type: 'SET_MODE', mode: 'floorplan' })}
                >
                    Edit Floor Plan
                </Button>
                <Button
                    variant={isHeatmap ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => dispatch({ type: 'SET_MODE', mode: 'heatmap' })}
                >
                    View Heatmap
                </Button>
            </div>

            {/* Active mode */}
            {isHeatmap ? (
                <HeatmapViewer
                    state={state}
                    dispatch={dispatch}
                    cellSize={CELL_SIZE}
                    generations={GENERATIONS}
                />
            ) : (
                <FloorplanEditor
                    state={state}
                    dispatch={dispatch}
                    cellSize={CELL_SIZE}
                />
            )}

        </div>
    );
}