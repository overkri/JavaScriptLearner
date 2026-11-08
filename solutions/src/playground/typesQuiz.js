/**
 * Эталон модуля 1.4 — прогнозы типов.
 * Значения можно проверить в Node REPL или DevTools Console.
 */

/** @type {Record<string, unknown>} */
export const answers = {
  typeofNull: 'object',
  typeofFunction: 'function',
  typeofNaN: 'number',
  sumFloats: 0.30000000000000004,
  concatNumber: '52',
  subtractNumber: 3,
  emptyArrayPlusObject: '[object Object]',
  nanEqualsItself: false,
  nullLooseEqualsUndefined: true,
  nullStrictEqualsUndefined: false,
  stringZeroIsTruthy: true,
  defaultSort: [1, 10, 9],
};
