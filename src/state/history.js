/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 9 · УПРАЖНЕНИЕ 9.4 — Undo/Redo вокруг reducer
 * ═══════════════════════════════════════════════════════════
 *  Тема:           HOC над reducer, past/present/future, лимит истории
 *  Java-аналогия:  command history / undo stack в редакторе
 *  Тесты:          npx vitest run tests/m09/history.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  withHistory(reducer, { limit = 50 }) → новый reducer.
 *  Состояние: { past: [], present: state, future: [] }.
 *  - обычное действие: present = reducer(present, action); если ссылка
 *    не изменилась — вернуть state; иначе положить старый present
 *    в past (не длиннее limit), очистить future;
 *  - UNDO: последний past → present, текущий present → future;
 *    если past пуст — вернуть тот же state;
 *  - REDO: первый future → present, текущий present → past;
 *    если future пуст — вернуть тот же state;
 *  - canUndo(state) / canRedo(state) — по длине past/future.
 *
 *  ПОДСКАЗКА
 *  Для инициализации: if (!state || !Array.isArray(state.past))
 *    return { past: [], present: reducer(undefined, action), future: [] };
 *
 *  ЛОВУШКА
 *  Новое действие после Undo должно ОЧИСТИТЬ future, иначе Redo
 *  приведёт к «мертвой» ветке истории.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {{ past: any[], present: any, future: any[] }} HistoryState
 */

/**
 * @template S
 * @template A
 * @param {(state: S, action: A) => S} reducer
 * @param {{ limit?: number }} [options]
 * @returns {(state: HistoryState|undefined, action: A) => HistoryState}
 */
export function withHistory(reducer, options = {}) {
  throw new Error('TODO 9.4: not implemented');
}

/** @param {HistoryState} state */
export function canUndo(state) {
  throw new Error('TODO 9.4b: not implemented');
}

/** @param {HistoryState} state */
export function canRedo(state) {
  throw new Error('TODO 9.4c: not implemented');
}
