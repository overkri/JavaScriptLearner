/**
 * Эталон модуля 1.5 — hoisting и область видимости.
 */

/** @type {Record<string, unknown>} */
export const predictions = {
  varBeforeDeclaration: 'undefined',
  letBlockShadowing: 1,
  constObjectMutation: 2,
  letBeforeDeclaration: 'ReferenceError',
  functionBeforeDeclaration: 'works',
  constArrayMutation: 'allowed',
};
