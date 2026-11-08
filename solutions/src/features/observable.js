/**
 * Эталон модуля 10.5 — глубокий observable на Proxy.
 */

/**
 * @typedef {{ type: 'set'|'delete', path: string[], value: any, oldValue: any }} Change
 */

/**
 * @template {object} T
 * @param {T} target
 * @param {(change: Change) => void} [onChange]
 * @returns {T}
 */
export function observable(target, onChange = () => {}) {
  /** @type {WeakMap<object, any>} */
  const cache = new WeakMap();

  /**
   * @param {any} value
   * @param {string[]} path
   * @returns {any}
   */
  function wrap(value, path) {
    if (value === null || typeof value !== 'object') return value;
    if (value instanceof Date || value instanceof Map || value instanceof Set) return value;

    const cached = cache.get(value);
    if (cached) return cached;

    const proxy = new Proxy(value, {
      get(obj, prop, receiver) {
        const result = Reflect.get(obj, prop, receiver);
        if (typeof prop === 'symbol') return result;
        return wrap(result, [...path, prop]);
      },

      set(obj, prop, next, receiver) {
        const previous = Reflect.get(obj, prop, receiver);
        const ok = Reflect.set(obj, prop, next, receiver);
        if (ok && !Object.is(previous, next) && typeof prop !== 'symbol') {
          onChange({
            type: 'set',
            path: [...path, prop],
            value: next,
            oldValue: previous,
          });
        }
        return ok;
      },

      deleteProperty(obj, prop) {
        const existed = Reflect.has(obj, prop);
        const previous = Reflect.get(obj, prop);
        const ok = Reflect.deleteProperty(obj, prop);
        if (ok && existed && typeof prop !== 'symbol') {
          onChange({
            type: 'delete',
            path: [...path, prop],
            value: undefined,
            oldValue: previous,
          });
        }
        return ok;
      },
    });

    cache.set(value, proxy);
    return proxy;
  }

  return wrap(target, []);
}
