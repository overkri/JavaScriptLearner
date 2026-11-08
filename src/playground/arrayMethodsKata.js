/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 3 · УПРАЖНЕНИЕ 3.6 — Kata: методы массивов
 * ═══════════════════════════════════════════════════════════
 *  Тема:           map/filter/reduce/find/findIndex/some/every/
 *                  flat/flatMap/at/toSorted/toSpliced
 *  Java-аналогия:  Stream API, но методы массива возвращают новые массивы
 *  Тесты:          npx vitest run tests/m03/arrayMethodsKata.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  Реализуйте функции БЕЗ циклов for/while — только методы массивов.
 *   1. doubleAll(numbers)            — map
 *   2. onlyEven(numbers)             — filter
 *   3. sum(numbers)                  — reduce
 *   4. findTaskByTitle(tasks, query) — find, регистронезависимо
 *   5. indexOfPriority(tasks, p)     — findIndex, -1 если нет
 *   6. hasOverdue(tasks)             — some + isOverdue
 *   7. allDone(tasks)                — every
 *   8. flattenTags(tasks)            — flatMap
 *   9. lastTag(tasks)                — at(-1)
 *  10. sortedNumbers(numbers)        — toSorted, числовая сортировка
 *  11. insertAt(numbers, i, value)   — toSpliced, без мутации
 *
 *  ПОДСКАЗКИ
 *  - sort() по умолчанию сравнивает строки: [10, 9, 1].sort() → [1, 10, 9].
 *    Для чисел нужен компаратор (a, b) => a - b.
 *  - toSorted/toSpliced/at — ES2023, не мутируют исходный массив.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {import('../domain/task.js').Task} Task
 */

/** @param {number[]} numbers @returns {number[]} */
export function doubleAll(numbers) {
  throw new Error('TODO 3.6.1: not implemented');
}

/** @param {number[]} numbers @returns {number[]} */
export function onlyEven(numbers) {
  throw new Error('TODO 3.6.2: not implemented');
}

/** @param {number[]} numbers @returns {number} */
export function sum(numbers) {
  throw new Error('TODO 3.6.3: not implemented');
}

/** @param {Task[]} tasks @param {string} query @returns {Task|undefined} */
export function findTaskByTitle(tasks, query) {
  throw new Error('TODO 3.6.4: not implemented');
}

/** @param {Task[]} tasks @param {string} priority @returns {number} */
export function indexOfPriority(tasks, priority) {
  throw new Error('TODO 3.6.5: not implemented');
}

/** @param {Task[]} tasks @returns {boolean} */
export function hasOverdue(tasks) {
  throw new Error('TODO 3.6.6: not implemented');
}

/** @param {Task[]} tasks @returns {boolean} */
export function allDone(tasks) {
  throw new Error('TODO 3.6.7: not implemented');
}

/** @param {Task[]} tasks @returns {string[]} */
export function flattenTags(tasks) {
  throw new Error('TODO 3.6.8: not implemented');
}

/** @param {Task[]} tasks @returns {string|undefined} */
export function lastTag(tasks) {
  throw new Error('TODO 3.6.9: not implemented');
}

/** @param {number[]} numbers @returns {number[]} */
export function sortedNumbers(numbers) {
  throw new Error('TODO 3.6.10: not implemented');
}

/** @param {number[]} numbers @param {number} index @param {number} value @returns {number[]} */
export function insertAt(numbers, index, value) {
  throw new Error('TODO 3.6.11: not implemented');
}
