/**
 * Эталон модуля 11.4 — исправленные типы.
 */

/**
 * @param {string} title
 * @returns {number}
 */
export function titleLength(title) {
  return title.length;
}

/**
 * @param {number} count
 * @returns {number}
 */
export function incrementCount(count) {
  return count + 1;
}

/**
 * @typedef {{ id: string, title: string }} TaskLike
 */

/**
 * @param {TaskLike} task
 * @returns {string}
 */
export function taskLabel(task) {
  return task.title;
}

/**
 * @param {string} text
 * @returns {number}
 */
export function parseCount(text) {
  return Number(text);
}

/** @type {string} */
export const DEFAULT_PRIORITY = 'medium';
