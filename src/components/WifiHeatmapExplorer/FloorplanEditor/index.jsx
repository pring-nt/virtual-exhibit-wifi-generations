import { useRef, useEffect, useState } from 'react';
import { CELL_CONFIGS } from '../lib/CellTypes.js';
import MaterialToolbar from './MaterialToolbar.jsx';
import RouterMarker from './RouterMarker.jsx';
import { drawOuterBorder, drawRouter } from '../lib/CanvasUtils.js';

const ROUTER_COLOR    = '#38bdf8';
const ROUTER_SELECTED = '#f59e0b';
const ROUTER_OUTLINE  = '#0f172a';
const GRID_LINE_COLOR = '#1e293b';

function drawFloorplan(ctx, state, cellSize, isRouterSelected) {
    const { grid, gridWidth, gridHeight, router } = state;
    const W = gridWidth  * cellSize;
    const H = gridHeight * cellSize;

    ctx.clearRect(0, 0, W, H);

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            ctx.fillStyle = CELL_CONFIGS[grid[y * gridWidth + x]].color;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

    ctx.beginPath();
    for (let x = 0; x <= gridWidth; x++) {
        ctx.moveTo(x * cellSize + 0.5, 0);
        ctx.lineTo(x * cellSize + 0.5, H);
    }
    for (let y = 0; y <= gridHeight; y++) {
        ctx.moveTo(0,  y * cellSize + 0.5);
        ctx.lineTo(W, y * cellSize + 0.5);
    }
    ctx.strokeStyle = GRID_LINE_COLOR;
    ctx.lineWidth   = 0.5;
    ctx.stroke();

    drawOuterBorder(ctx, W, H);
    drawRouter(
        ctx,
        router,
        cellSize,
        isRouterSelected ? ROUTER_SELECTED : ROUTER_COLOR,
        ROUTER_OUTLINE
    );
}

export default function FloorplanEditor({ state, dispatch, cellSize }) {
    const canvasRef         = useRef(null);
    const [isRouterSelected, setIsRouterSelected] = useState(false);
    const isDragging        = useRef(false);

    const handleStartRef = useRef(null);
    const handleMoveRef  = useRef(null);
    const handleEndRef   = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        drawFloorplan(canvas.getContext('2d'), state, cellSize, isRouterSelected);
    }, [state, cellSize, isRouterSelected]);

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.style.cursor = isRouterSelected ? 'cell' : 'crosshair';
        }
    }, [isRouterSelected]);

    function getCellCoords(e) {
        const canvas = canvasRef.current;
        if (!canvas) return { x: -1, y: -1 };

        const rect    = canvas.getBoundingClientRect();
        const clientX = e.touches?.length > 0 ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches?.length > 0 ? e.touches[0].clientY : e.clientY;
        const scaleX  = canvas.width  / rect.width;
        const scaleY  = canvas.height / rect.height;

        return {
            x: Math.floor((clientX - rect.left) * scaleX / cellSize),
            y: Math.floor((clientY - rect.top)  * scaleY / cellSize),
        };
    }

    function inBounds(x, y) {
        return x >= 0 && x < state.gridWidth && y >= 0 && y < state.gridHeight;
    }

    function handleStart(e) {
        e.preventDefault();
        const { x, y } = getCellCoords(e);
        if (!inBounds(x, y)) return;

        if (x === state.router.x && y === state.router.y) {
            setIsRouterSelected(prev => !prev);
            return;
        }
        if (isRouterSelected) {
            dispatch({ type: 'MOVE_ROUTER', x, y });
            setIsRouterSelected(false);
            return;
        }
        isDragging.current = true;
        dispatch({ type: 'PAINT_CELL', x, y });
    }

    function handleMove(e) {
        e.preventDefault();
        const { x, y } = getCellCoords(e);

        if (canvasRef.current && !isRouterSelected && !e.touches) {
            const overRouter = x === state.router.x && y === state.router.y;
            canvasRef.current.style.cursor = overRouter ? 'pointer' : 'crosshair';
        }

        if (!isDragging.current) return;
        if (!inBounds(x, y)) return;
        dispatch({ type: 'PAINT_CELL', x, y });
    }

    function handleEnd(e) {
        e?.preventDefault();
        isDragging.current = false;
    }

    handleStartRef.current = handleStart;
    handleMoveRef.current  = handleMove;
    handleEndRef.current   = handleEnd;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const onStart = (e) => handleStartRef.current?.(e);
        const onMove  = (e) => handleMoveRef.current?.(e);
        const onEnd   = (e) => handleEndRef.current?.(e);

        const opts = { passive: false };
        canvas.addEventListener('touchstart',  onStart, opts);
        canvas.addEventListener('touchmove',   onMove,  opts);
        canvas.addEventListener('touchend',    onEnd,   opts);
        canvas.addEventListener('touchcancel', onEnd,   opts);

        return () => {
            canvas.removeEventListener('touchstart',  onStart, opts);
            canvas.removeEventListener('touchmove',   onMove,  opts);
            canvas.removeEventListener('touchend',    onEnd,   opts);
            canvas.removeEventListener('touchcancel', onEnd,   opts);
        };
    }, []);

    return (
        <div className="flex flex-col gap-3 w-full min-w-0 max-w-full">
            <MaterialToolbar
                state={state}
                dispatch={dispatch}
                isRouterSelected={isRouterSelected}
                onMoveRouter={() => setIsRouterSelected(true)}
                onDeselect={() => setIsRouterSelected(false)}
                onClearAll={() => dispatch({ type: 'CLEAR_GRID' })}
            />

            <canvas
                ref={canvasRef}
                width={state.gridWidth  * cellSize}
                height={state.gridHeight * cellSize}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                className="block border border-border rounded-sm select-none w-full h-auto touch-none"
                style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', aspectRatio: '4/3' }}
            />

            <RouterMarker
                router={state.router}
                isRouterSelected={isRouterSelected}
                onDeselect={() => setIsRouterSelected(false)}
            />
        </div>
    );
}