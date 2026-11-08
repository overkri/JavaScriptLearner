/**
 * Эталон модуля 2.3 — замыкания.
 */

/** @type {Record<string, unknown>} */
export const predictions = {
  varLoop: [3, 3, 3],
  letLoop: [0, 1, 2],
};

/**
 * @param {number} [start]
 * @returns {{ increment: () => number, decrement: () => number, reset: () => number, readonly value: number }}
 */
export function createCounter(start = 0) {
  let value = start;
  return {
    increment() {
      value += 1;
      return value;
    },
    decrement() {
      value -= 1;
      return value;
    },
    reset() {
      value = start;
      return value;
    },
    get value() {
      return value;
    },
  };
}

/** @returns {number[]} */
export function fixLoopWithLet() {
  /** @type {Array<() => number>} */
  const fns = [];
  for (let i = 0; i < 3; i += 1) {
    fns.push(() => i);
  }
  return fns.map((fn) => fn());
}

/** @returns {number[]} */
export function fixLoopWithIife() {
  /** @type {Array<() => number>} */
  const fns = [];
  for (var i = 0; i < 3; i += 1) {
    ((captured) => {
      fns.push(() => captured);
    })(i);
  }
  return fns.map((fn) => fn());
}
