/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 9 · УПРАЖНЕНИЕ 9.5 — Селекторы с мемоизацией
 * ═══════════════════════════════════════════════════════════
 *  Тема:           memoization, производные данные, ссылочная стабильность
 *  Java-аналогия:  кэш вычислений; но ключ — ссылки на входные данные
 *  Тесты:          npx vitest run tests/m09/selectors.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  1. createSelector(...inputSelectors, resultFn) — мемоизация на ОДИН
 *     последний набор входов (как reselect). Если все входы Object.is
 *     равны предыдущим — вернуть тот же результат, не вызывая resultFn.
 *  2. selectVisibleTasks(state) — filterTasks(state.tasks, state.filter),
 *     мемоизирован.
 *  3. selectStats(state) — computeStats(state.tasks), мемоизирован.
 *  4. selectTags(state) — collectTags(state.tasks), мемоизирован.
 *
 *  ТРЕБОВАНИЯ
 *  - Одинаковый state → тот же ссылочный результат.
 *  - resultFn вызывается ровно 1 раз для повторного вызова с теми же входами.
 *
 *  ПОДСКАЗКА
 *  Храните lastInputs и lastResult. Сравнивайте через Object.is.
 *
 *  ЛОВУШКА
 *  Если создавать selector внутри компонента, кэш будет создаваться
 *  заново при каждом рендере. Селекторы объявляйте на уровне модуля.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {import('../domain/task.js').Task} Task
 * @typedef {{ tasks: Task[], filter: { status?: string, priority?: string, tag?: string|null, text?: string } }} State
 */

/**
 * @param {...((state: any) => any) | ((...args: any[]) => any)} inputSelectors
 * @returns {(state: any) => any}
 */
export function createSelector(...inputSelectors) {
  throw new Error('TODO 9.5.1: not implemented');
}

/** @param {State} state @returns {Task[]} */
export function selectVisibleTasks(state) {
  throw new Error('TODO 9.5.2: not implemented');
}

/** @param {State} state @returns {import('../domain/stats.js').TaskStats} */
export function selectStats(state) {
  throw new Error('TODO 9.5.3: not implemented');
}

/** @param {State} state @returns {Set<string>} */
export function selectTags(state) {
  throw new Error('TODO 9.5.4: not implemented');
}
