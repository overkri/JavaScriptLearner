/**
 * Эталон модуля 2.4 — this в обычных и стрелочных функциях.
 */

/** @type {Record<string, unknown>} */
export const predictions = {
  regularMethodCall: 'obj',
  arrowCapturesOuterThis: 'outer',
  arrowHasNoArguments: 2,
  arrowCannotBeNew: true,
};

/**
 * @returns {{ count: number, run: () => number }}
 */
export function createLexicalThisCounter() {
  return {
    count: 0,
    run() {
      const tick = () => {
        this.count += 1;
      };
      for (let i = 0; i < 3; i += 1) tick();
      return this.count;
    },
  };
}
