/**
 * Эталон модуля 5.3 — вторая половина цикла.
 */

import { getA } from './a.js';

export const b = { name: 'b' };

/** @returns {{ name: string }} */
export function getB() {
  return b;
}

/** @returns {string} */
export function describeBack() {
  return `${b.name}<-${getA().name}`;
}
