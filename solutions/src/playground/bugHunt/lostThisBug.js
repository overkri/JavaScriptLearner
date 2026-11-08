/**
 * Эталон модуля 11.2 — this через замыкание.
 */

/**
 * @returns {{ state: { count: number }, increment: () => void }}
 */
export function createCounterBug() {
  const state = { count: 0 };
  return {
    state,
    increment: () => {
      state.count += 1;
    },
  };
}
