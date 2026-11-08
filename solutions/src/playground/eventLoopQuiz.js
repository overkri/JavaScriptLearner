/**
 * Эталон модуля 7.5 — предсказанный порядок event loop.
 */

/** @type {Record<string, string[]>} */
export const predictions = {
  syncPromiseTimeout: ['sync', 'end', 'promise', 'timeout'],
  asyncAwait: ['foo-start', 'after-call', 'foo-end'],
  microtasksBeforeTimers: ['then1', 'microtask', 'then2', 'timeout1', 'timeout2'],
  microtaskOrder: ['promise', 'queueMicrotask'],
  asyncIife: ['iife-start', 'inner', 'sync', 'then', 'iife-end'],
  nestedMicrotask: ['then-start', 'nested', 'then-end', 'timeout'],
};
