/**
 * Эталон модуля 4.5 — this и привязка контекста.
 */

/** @type {Record<string, unknown>} */
export const predictions = {
  methodCall: 'obj',
  detachedCallback: 'undefined',
  boundMethod: 'obj',
  callChangesThis: 'other',
  arrowInMethod: 'obj',
};

/**
 * @returns {{ increment: () => number, readonly value: number }}
 */
export function createBoundCounter() {
  const state = { count: 0 };
  function increment() {
    state.count += 1;
    return state.count;
  }
  return {
    increment: increment.bind(state),
    get value() {
      return state.count;
    },
  };
}

/**
 * @template {Record<string, any>} T
 * @param {T} obj
 * @param {...string} names
 * @returns {T}
 */
export function bindMethods(obj, ...names) {
  const bound = { ...obj };
  for (const name of names) {
    const value = obj[name];
    if (typeof value === 'function') {
      /** @type {any} */ (bound)[name] = value.bind(obj);
    }
  }
  return bound;
}
