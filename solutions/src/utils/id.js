/**
 * Эталон модуля 2.1 — замыкание-счётчик.
 */

/**
 * @param {string} [prefix]
 * @returns {() => string}
 */
export function createIdGenerator(prefix = 'task') {
  let counter = 0;
  return () => `${prefix}-${++counter}`;
}

/**
 * @returns {string}
 */
export function uid() {
  return crypto.randomUUID();
}
