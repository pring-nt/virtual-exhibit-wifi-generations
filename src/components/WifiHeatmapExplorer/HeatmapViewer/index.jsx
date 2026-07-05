import { useRef, useEffect } from 'react';
import { CELL_TYPE, CELL_CONFIGS } from '../lib/CellTypes.js';
import GenerationSelector from './GenerationSelector.jsx';

// ---------------------------------------------------------------------------
// Signal → color mapping
// Three-stop gradient: red (weak) → yellow (medium) → green (strong)
// Values at or below 0 are treated as no signal and rendered dark.
// ---------------------------------------------------------------------------

const COLOR_STOPS = [
    [239, 68,  68],   // red    — weak signal   (value ~ 0.0)
    [234, 179,  8],   // yellow — medium signal  (value ~ 0.5)
    [ 34, 197, 94],   // green  — strong signal  (value ~ 1.0)
];
const NO_SIGNAL_COLOR = 'rgb(15, 20, 30)';

/**
 * Maps a normalized signal value (0–1) to an RGB CSS string.
 * @param {number} value
 * @returns {string}
 */
function signalToColor(value) {
    if (value <= 0) return NO_SIGNAL_COLOR;

    const t = Math.max(0, Math.min(1, value));

    let a, b, f;
    if (t <= 0.5) {
        a = COLOR_STOPS[0]; b = COLOR_STOPS[1]; f = t / 0.5;
    } else {
        a = COLOR_STOPS[1]; b = COLOR_STOPS[2]; f = (t - 0.5) / 0.5;
    }

    const r = Math.round(a[0] + (b[0] - a[0]) * f);
    const g = Math.round(a[1] + (b[1] - a[1]) * f);
    const bl = Math.round(a[2] + (b[2] - a[2]) * f);
    return `rgb(${r}, ${g}, ${bl})`;
}

// ---------------------------------------------------------------------------
// Canvas draw
// ---------------------------------------------------------------------------

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} state
 * @param {number} cellSize
 * @param {Float32Array} heatmap  - normalized 0–1 signal per cell
 */
function drawHeatmap(ctx, state, cellSize, heatmap) {
    const { grid, gridWidth, gridHeight, router } = state;
    const W = gridWidth  * cellSize;
    const H = gridHeight * cellSize;

    ctx.clearRect(0, 0, W, H);

    // --- Signal colors ---
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const idx = y * gridWidth + x;
            ctx.fillStyle = signalToColor(heatmap[idx]);
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

    // --- Wall overlay — semi-transparent fill so walls read on top of signal colors ---
    ctx.save();
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const cellType = grid[y * gridWidth + x];
            if (cellType === CELL_TYPE.EMPTY) continue;

            const config = CELL_CONFIGS[cellType];
            ctx.globalAlpha = 0.55;
            ctx.fillStyle   = config.color;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

            // Edge outline at full opacity for legibility
            ctx.globalAlpha = 1;
            ctx.strokeStyle = config.edgeColor;
            ctx.lineWidth   = 0.5;
            ctx.strokeRect(x * cellSize + 0.5, y * cellSize + 0.5, cellSize - 1, cellSize - 1);
        }
    }
    ctx.restore();

    // --- Outer border ---
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth   = 1;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

    // --- Router marker (read-only — white with dark outline) ---
    const cx = router.x * cellSize + cellSize / 2;
    const cy = router.y * cellSize + cellSize / 2;
    const r  = cellSize * 0.36;

    ctx.fillStyle   = '#ffffff';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

// ---------------------------------------------------------------------------
// Signal strength legend
// ---------------------------------------------------------------------------

const LEGEND = [
    { label: 'No signal', color: NO_SIGNAL_COLOR },
    { label: 'Weak',      color: `rgb(${COLOR_STOPS[0].join(',')})` },
    { label: 'Medium',    color: `rgb(${COLOR_STOPS[1].join(',')})` },
    { label: 'Strong',    color: `rgb(${COLOR_STOPS[2].join(',')})` },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * @param {{
 *   state: object,
 *   dispatch: Function,
 *   cellSize: number,
 *   generations: import('../lib/Generations.js').Generation[],
 * }} props
 */
export default function HeatmapViewer({ state, dispatch, cellSize, generations }) {
    const canvasRef = useRef(null);
    const { activeGeneration, heatmaps } = state;
    const heatmap = heatmaps[activeGeneration];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !heatmap) return;
        const ctx = canvas.getContext('2d');
        drawHeatmap(ctx, state, cellSize, heatmap);
    }, [state, cellSize, heatmap]);

    return (
        <div className="flex flex-col gap-3">

            <GenerationSelector
                activeIndex={activeGeneration}
                generations={generations}
                onSelect={(index) => dispatch({ type: 'SET_GENERATION', index })}
            />

            <canvas
                ref={canvasRef}
                width={state.gridWidth  * cellSize}
                height={state.gridHeight * cellSize}
                className="block border border-border rounded-sm"
            />

            {/* Signal strength legend */}
            <div className="flex items-center gap-4">
                {LEGEND.map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
                className="inline-block w-3 h-3 rounded-sm border border-border shrink-0"
                style={{ backgroundColor: color }}
            />
                        {label}
                    </div>
                ))}
            </div>

        </div>
    );
}