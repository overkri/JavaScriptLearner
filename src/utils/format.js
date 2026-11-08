/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 1 · УПРАЖНЕНИЕ 1.2 — Форматирование задач
 * ═══════════════════════════════════════════════════════════
 *  Тема:           строки, regexp, шаблонные строки, ?. и ??
 *  Java-аналогия:  String.trim/replaceAll + String.format
 *  Тесты:          npx vitest run tests/m01/format.test.js
 *  Уровень:        ★☆☆
 *
 *  ЗАДАНИЕ
 *  1. formatTitle(str):
 *     - не строка → '';
 *     - trim, схлопнуть повторные пробелы в один;
 *     - если длиннее 80 символов — обрезать до 80, последний символ «…».
 *  2. formatTags(tags) → строка вида "#work #home".
 *     Не массив/пустые элементы → пустая строка.
 *  3. describeTask(task) — шаблонная строка с заголовком, приоритетом,
 *     тегами и дедлайном. Должна переживать task === null/undefined.
 *
 *  ПОДСКАЗКА
 *  value.replace(/\s+/g, ' ') схлопывает пробелы.
 *  task?.title и task?.tags ?? [] — безопасный доступ.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @param {unknown} value
 * @returns {string}
 */
export function formatTitle(value) {
  throw new Error('TODO 1.2.1: not implemented');
}

/**
 * @param {unknown} tags
 * @returns {string}
 */
export function formatTags(tags) {
  throw new Error('TODO 1.2.2: not implemented');
}

/**
 * @param {import('../domain/task.js').Task|null|undefined} task
 * @returns {string}
 */
export function describeTask(task) {
  throw new Error('TODO 1.2.3: not implemented');
}
