/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 10 · УПРАЖНЕНИЕ 10.6 — Symbol и WeakMap
 * ═══════════════════════════════════════════════════════════
 *  Тема:           Symbol как ключ, WeakMap для приватных данных и кэша
 *  Java-аналогия:  private-поле и WeakHashMap, но без утечек памяти
 *  Тесты:          npx vitest run tests/m10/symbolsAndWeakMap.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  1. Экспортируйте INTERNAL = Symbol('taskflow.internal').
 *  2. attachInternal(obj, value) — добавьте значение по ключу INTERNAL
 *     как НЕперечисляемое свойство (не видно в Object.keys/JSON/spread),
 *     верните obj. readInternal(obj) читает его.
 *  3. createPrivateStore() → { set(target, value), get(target),
 *     has(target), delete(target) } на основе WeakMap. Ключ — объект.
 *  4. memoizeByObject(fn) — кэш результатов по объекту-ключу через
 *     WeakMap: для одного и того же объекта fn вызывается один раз.
 *
 *  ПОДСКАЗКА
 *  Object.defineProperty(obj, INTERNAL, { value, enumerable: false }).
 *  WeakMap не перечисляется и не мешает сборке мусора.
 * ═══════════════════════════════════════════════════════════
 */

export const INTERNAL = Symbol('taskflow.internal');

/**
 * @template {object} T
 * @param {T} obj
 * @param {any} value
 * @returns {T}
 */
export function attachInternal(obj, value) {
  throw new Error('TODO 10.6.1: not implemented');
}

/**
 * @param {object} obj
 * @returns {any}
 */
export function readInternal(obj) {
  throw new Error('TODO 10.6.2: not implemented');
}

/**
 * @returns {{ set: (target: object, value: any) => object, get: (target: object) => any, has: (target: object) => boolean, delete: (target: object) => boolean }}
 */
export function createPrivateStore() {
  throw new Error('TODO 10.6.3: not implemented');
}

/**
 * @template {object} K, V
 * @param {(key: K) => V} fn
 * @returns {(key: K) => V}
 */
export function memoizeByObject(fn) {
  throw new Error('TODO 10.6.4: not implemented');
}
