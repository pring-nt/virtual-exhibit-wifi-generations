import { CELL_TYPE, CELL_CONFIGS } from '../lib/CellTypes.js';

/**
 * The toolbar entries, in display order.
 * Empty cell acts as the eraser — painting it resets a wall back to open space.
 */
const MATERIALS = [
    CELL_CONFIGS[CELL_TYPE.EMPTY],
    CELL_CONFIGS[CELL_TYPE.DRYWALL],
    CELL_CONFIGS[CELL_TYPE.CONCRETE],
    CELL_CONFIGS[CELL_TYPE.METAL],
];

/**
 * @param {{ state: object, dispatch: Function }} props
 */
export default function MaterialToolbar({ state, dispatch }) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            {MATERIALS.map((config) => {
                const isActive = state.activeMaterial === config.type;
                return (
                    <button
                        key={config.key}
                        onClick={() => dispatch({ type: 'SET_MATERIAL', material: config.type })}
                        className={[
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm border transition-colors select-none',
                            isActive
                                ? 'border-slate-800 bg-slate-800 text-white'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900',
                        ].join(' ')}
                    >
                        {/* Color swatch */}
                        <span
                            className="inline-block w-3 h-3 rounded-sm border border-slate-300 shrink-0"
                            style={{ backgroundColor: config.color }}
                        />
                        {config.type === CELL_TYPE.EMPTY ? 'Eraser' : config.label}
                    </button>
                );
            })}
        </div>
    );
}