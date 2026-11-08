/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 9 · УПРАЖНЕНИЕ 9.1 — Reducer
 * ═══════════════════════════════════════════════════════════
 *  Тема:           чистые reducer'ы, actions, иммутабельность
 *  Java-аналогия:  useReducer/Redux — это паттерн «событие → новое состояние»;
 *                  аналог — обработчик команды, возвращающий новый snapshot
 *  Тесты:          npx vitest run tests/m09/reducer.test.js
 *  Уровень:        ★★★
 *
 *  СТРУКТУРА STATE
 *  { tasks: Task[], filter: { status, priority, tag, text } }
 *
 *  ДЕЙСТВИЯ
 *  TASKS_LOADED { tasks }        — заменить список
 *  TASK_ADDED { task }           — addTask
 *  TASK_UPDATED { id, patch }    — replaceTask
 *  TASK_REMOVED { id }           — removeTask
 *  TASK_MOVED { id, status }     — moveTask
 *  FILTER_CHANGED { filter }     — shallow-merge с текущим filter
 *
 *  ТРЕБОВАНИЯ
 *  - reducer чистый: не мутирует state и action;
 *  - используйте taskOps из модуля 3;
 *  - неизвестное действие (и action без type) возвращает ТОТ ЖЕ объект state;
 *  - если tasks не изменились, тоже можно вернуть тот же state.
 *
 *  ЛОВУШКА
 *  Новый state с той же ссылкой на массив tasks не заметит React:
 *  сравниваются ссылки. Возвращайте новые массивы только при изменении.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {import('../domain/task.js').Task} Task
 * @typedef {{ status: string, priority: string, tag: string|null, text: string }} TaskFilter
 * @typedef {{ tasks: Task[], filter: TaskFilter }} State
 */

/** @returns {State} */
export function createInitialState() {
  throw new Error('TODO 9.1.0: not implemented');
}

/**
 * @param {State} state
 * @param {{ type?: string, [key: string]: any }} action
 * @returns {State}
 */
export function reducer(state, action) {
  throw new Error('TODO 9.1: not implemented');
}
