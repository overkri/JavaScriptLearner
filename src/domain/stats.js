/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 3 · УПРАЖНЕНИЕ 3.4 — Статистика одним проходом
 * ═══════════════════════════════════════════════════════════
 *  Тема:           reduce, Map, сортировка, агрегация
 *  Java-аналогия:  Collectors.groupingBy + counting, но вручную
 *  Тесты:          npx vitest run tests/m03/stats.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  computeStats(tasks) → {
 *    total: number,
 *    byStatus: { todo, 'in-progress', done },
 *    byPriority: { low, medium, high },
 *    overdue: number,
 *    completionRate: number,   // done / total, 0 для пустого списка
 *    topTags: Array<{ tag: string, count: number }>  // top-3
 *  }
 *
 *  ТРЕБОВАНИЯ
 *  - Все счётчики (включая теги) собираются ОДНИМ проходом reduce.
 *  - topTags сортируется по count убыванию, при равенстве — по алфавиту.
 *  - Просроченность считайте через isOverdue из task.js.
 *  - Пустой массив возвращает нули и [].
 *
 *  ПОДСКАЗКА
 *  Внутри reduce можно держать Map тегов в аккумуляторе, а topTags
 *  вычислить после прохода через [...map.entries()].sort(...).
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {import('./task.js').Task} Task
 */

/**
 * @typedef {Object} TaskStats
 * @property {number} total
 * @property {{ todo: number, 'in-progress': number, done: number }} byStatus
 * @property {{ low: number, medium: number, high: number }} byPriority
 * @property {number} overdue
 * @property {number} completionRate
 * @property {Array<{ tag: string, count: number }>} topTags
 */

/**
 * @param {Task[]} tasks
 * @returns {TaskStats}
 */
export function computeStats(tasks) {
  throw new Error('TODO 3.4: not implemented');
}
