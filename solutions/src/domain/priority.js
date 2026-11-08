/**
 * Эталон модуля 1.1 — приоритеты.
 */

/** @typedef {'low'|'medium'|'high'} Priority */

/** @type {Readonly<{ LOW: Priority, MEDIUM: Priority, HIGH: Priority }>} */
export const PRIORITY = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
});

/** @type {Readonly<Record<string, number>>} */
const WEIGHTS = Object.freeze({ low: 1, medium: 2, high: 3 });

/**
 * @param {string} priority
 * @returns {number}
 */
export function priorityWeight(priority) {
  return WEIGHTS[priority] ?? -1;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isPriority(value) {
  return typeof value === 'string' && Object.values(PRIORITY).includes(/** @type {Priority} */ (value));
}
