/**
 * RouterMarker
 *
 * A small status bar beneath the canvas.
 * Shows the router's current grid position and, when selected, prompts the
 * user to click a destination cell. Also surfaces a cancel action.
 *
 * The actual router dot is drawn on the canvas in FloorplanEditor/index.jsx —
 * this component is purely informational UI, not a canvas overlay.
 *
 * @param {{
 *   router: { x: number, y: number },
 *   isRouterSelected: boolean,
 *   onDeselect: () => void,
 * }} props
 */
export default function RouterMarker({ router, isRouterSelected, onDeselect }) {
    return (
        <div className="flex items-center gap-2 text-sm h-5">
            {/* Router indicator dot */}
            <span
                className="inline-block w-2.5 h-2.5 rounded-full shrink-0 transition-colors"
                style={{ backgroundColor: isRouterSelected ? '#f59e0b' : '#2563eb' }}
            />

            {isRouterSelected ? (
                <>
          <span className="text-amber-600 font-medium">
            Click an empty cell to place the router
          </span>
                    <button
                        onClick={onDeselect}
                        className="text-slate-400 hover:text-slate-600 underline text-xs ml-1"
                    >
                        Cancel
                    </button>
                </>
            ) : (
                <span className="text-slate-400">
          Router at ({router.x}, {router.y}) &mdash; click to move
        </span>
            )}
        </div>
    );
}