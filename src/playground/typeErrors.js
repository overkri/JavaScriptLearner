/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 11 · УПРАЖНЕНИЕ 11.4 — Пять типовых ошибок JSDoc
 * ═══════════════════════════════════════════════════════════
 *  Тема:           JSDoc + checkJs, @param/@returns, typedef
 *  Java-аналогия:  компилятор Java проверяет типы; tsc умеет делать
 *                  это и для JS — но только когда включён checkJs
 *  Проверка:       npm run typecheck (после включения checkJs в jsconfig.json)
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  1. Откройте jsconfig.json и включите "checkJs": true.
 *  2. Запустите npm run typecheck.
 *  3. Исправьте 5 ошибок, помеченных FIXME(11.4.x). Меняйте либо тип
 *     в JSDoc, либо реализацию — по смыслу функции.
 *
 *  Это упражнение не проверяется vitest: его проверяет tsc.
 * ═══════════════════════════════════════════════════════════
 */

// FIXME(11.4.1): функция обещает number, а возвращает string.
/**
 * @param {string} title
 * @returns {number}
 */
export function titleLength(title) {
  return title;
}

// FIXME(11.4.2): параметр объявлен строкой, но используется как число.
/**
 * @param {string} count
 * @returns {number}
 */
export function incrementCount(count) {
  return count + 1;
}

// FIXME(11.4.3): у объекта нет свойства name — есть title.
/**
 * @typedef {{ id: string, title: string }} TaskLike
 */

/**
 * @param {TaskLike} task
 * @returns {string}
 */
export function taskLabel(task) {
  return task.name;
}

// FIXME(11.4.4): возвращаемое значение не совпадает с @returns.
/**
 * @param {string} text
 * @returns {number}
 */
export function parseCount(text) {
  return text;
}

// FIXME(11.4.5): @type не совпадает с инициализатором.
/** @type {number} */
export const DEFAULT_PRIORITY = 'medium';
