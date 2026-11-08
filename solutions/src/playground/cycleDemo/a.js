/**
 * Эталон модуля 5.3 — цикл a ↔ b, безопасный благодаря ленивым функциям.
 */

import { getB } from './b.js';

export const a = { name: 'a' };

/** @returns {{ name: string }} */
export function getA() {
  return a;
}

/** @returns {string} */
export function describeCycle() {
  return `${a.name}->${getB().name}->${a.name}`;
}
