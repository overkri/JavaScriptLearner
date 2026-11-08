/**
 * Эталон модуля 9.4 — история состояний (undo/redo).
 */

/** @typedef {{ past: any[], present: any, future: any[] }} HistoryState */

/**
 * @template S, A
 * @param {(state: S, action: A) => S} reducer
 * @param {{ limit?: number }} [options]
 * @returns {(state: HistoryState|undefined, action: A) => HistoryState}
 */
export function withHistory(reducer, { limit = 50 } = {}) {
  const max = Math.max(0, limit);

  return function historyReducer(state, action) {
    if (!state || !Array.isArray(state.past) || !Array.isArray(state.future)) {
      return {
        past: [],
        present: reducer(undefined, action),
        future: [],
      };
    }

    if (action && /** @type {any} */ (action).type === 'UNDO') {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }

    if (action && /** @type {any} */ (action).type === 'REDO') {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return {
        past: [...state.past, state.present],
        present: next,
        future: rest,
      };
    }

    const present = reducer(state.present, action);
    if (present === state.present) return state;

    const past = [...state.past, state.present];
    if (past.length > max) {
      past.splice(0, past.length - max);
    }

    return { past, present, future: [] };
  };
}

/** @param {HistoryState} state */
export function canUndo(state) {
  return state.past.length > 0;
}

/** @param {HistoryState} state */
export function canRedo(state) {
  return state.future.length > 0;
}
