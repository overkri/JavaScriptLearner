import { describe, expect, it } from 'vitest';
import { answers } from '../../src/playground/typesQuiz.js';

/** Реальные значения тех же выражений. */
const actual = {
  typeofNull: typeof null,
  typeofFunction: typeof (() => {}),
  typeofNaN: typeof NaN,
  sumFloats: 0.1 + 0.2,
  concatNumber: '5' + 2,
  subtractNumber: /** @type {any} */ ('5') - 2,
  emptyArrayPlusObject: [] + {},
  nanEqualsItself: NaN === NaN,
  nullLooseEqualsUndefined: null == undefined,
  nullStrictEqualsUndefined: null === undefined,
  stringZeroIsTruthy: Boolean('0'),
  defaultSort: [10, 9, 1].sort(),
};

describe('Module 1 quiz — types', () => {
  for (const [key, value] of Object.entries(actual)) {
    it(`predicts ${key}`, () => {
      expect(answers[key], `answers.${key} не совпал с реальным значением`).toEqual(value);
    });
  }
});
