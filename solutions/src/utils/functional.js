/**
 * Эталон модуля 2.2 — функциональные утилиты.
 */

/**
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @returns {F}
 */
export function once(fn) {
  let called = false;
  /** @type {ReturnType<F>} */
  let result;
  /** @type {any} */
  let receiver = null;

  /** @type {any} */
  const wrapped = function (...args) {
    receiver = this;
    if (!called) {
      called = true;
      result = fn.apply(receiver, args);
    }
    return result;
  };

  return wrapped;
}

/**
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @param {number} ms
 * @returns {F & { cancel: () => void }}
 */
export function debounce(fn, ms) {
  /** @type {ReturnType<typeof setTimeout> | null} */
  let timer = null;
  /** @type {any[]} */
  let lastArgs = [];
  /** @type {any} */
  let lastThis = null;

  /** @type {any} */
  const debounced = function (...args) {
    lastArgs = args;
    lastThis = this;
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      const argsForCall = lastArgs;
      lastArgs = [];
      fn.apply(lastThis, argsForCall);
    }, ms);
  };

  debounced.cancel = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    lastArgs = [];
  };

  return debounced;
}

/**
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @param {number} ms
 * @returns {F}
 */
export function throttle(fn, ms) {
  let lastCall = -Infinity;

  /** @type {any} */
  const throttled = function (...args) {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      return fn.apply(this, args);
    }
    return undefined;
  };

  return throttled;
}

/**
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @param {(...args: any[]) => string} [keyFn]
 * @returns {F & { clear: () => void }}
 */
export function memoize(fn, keyFn = JSON.stringify) {
  /** @type {Map<any, any>} */
  const cache = new Map();

  /** @type {any} */
  const memoized = function (...args) {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key);
    const value = fn.apply(this, args);
    cache.set(key, value);
    return value;
  };

  memoized.clear = () => cache.clear();
  return memoized;
}

/**
 * @param {...(...args: any[]) => any} fns
 * @returns {(...args: any[]) => any}
 */
export function pipe(...fns) {
  /** @type {any} */
  const piped = function (...args) {
    if (fns.length === 0) return args[0];
    let result = fns[0].apply(this, args);
    for (let index = 1; index < fns.length; index += 1) {
      result = fns[index].call(this, result);
    }
    return result;
  };
  return piped;
}

/**
 * @param {...(...args: any[]) => any} fns
 * @returns {(...args: any[]) => any}
 */
export function compose(...fns) {
  return pipe(...fns.toReversed());
}

/**
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @returns {(...args: any[]) => any}
 */
export function curry(fn) {
  const arity = fn.length;

  /**
   * @param {any[]} collected
   * @returns {(...args: any[]) => any}
   */
  const collect = (collected) => {
    /** @type {any} */
    const next = function (...args) {
      const all = [...collected, ...args];
      if (all.length >= arity) return fn.apply(this, all);
      return collect(all);
    };
    return next;
  };

  return collect([]);
}

/**
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @param {...any} preset
 * @returns {(...args: any[]) => any}
 */
export function partial(fn, ...preset) {
  /** @type {any} */
  const applied = function (...args) {
    return fn.apply(this, [...preset, ...args]);
  };
  return applied;
}

/**
 * @template T
 * @param {(value: T) => unknown} fn
 * @returns {(value: T) => T}
 */
export function tap(fn) {
  return (value) => {
    fn(value);
    return value;
  };
}

/**
 * @template {(...args: any[]) => any} F
 * @param {F} predicate
 * @returns {(...args: Parameters<F>) => boolean}
 */
export function not(predicate) {
  return (...args) => !predicate(...args);
}
