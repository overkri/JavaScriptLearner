/**
 * Эталон модуля 10.6 — Symbol и WeakMap.
 */

export const INTERNAL = Symbol('taskflow.internal');

/**
 * @template {object} T
 * @param {T} obj
 * @param {any} value
 * @returns {T}
 */
export function attachInternal(obj, value) {
  Object.defineProperty(obj, INTERNAL, {
    value,
    enumerable: false,
    configurable: true,
    writable: true,
  });
  return obj;
}

/**
 * @param {object} obj
 * @returns {any}
 */
export function readInternal(obj) {
  return obj?.[INTERNAL];
}

/**
 * @returns {{ set: (target: object, value: any) => object, get: (target: object) => any, has: (target: object) => boolean, delete: (target: object) => boolean }}
 */
export function createPrivateStore() {
  /** @type {WeakMap<object, any>} */
  const store = new WeakMap();
  return {
    set(target, value) {
      store.set(target, value);
      return target;
    },
    get(target) {
      return store.get(target);
    },
    has(target) {
      return store.has(target);
    },
    delete(target) {
      return store.delete(target);
    },
  };
}

/**
 * @template {object} K, V
 * @param {(key: K) => V} fn
 * @returns {(key: K) => V}
 */
export function memoizeByObject(fn) {
  /** @type {WeakMap<K, V>} */
  const cache = new WeakMap();
  return (key) => {
    if (cache.has(key)) return /** @type {V} */ (cache.get(key));
    const value = fn(key);
    cache.set(key, value);
    return value;
  };
}
