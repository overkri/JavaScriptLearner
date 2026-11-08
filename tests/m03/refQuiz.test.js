import { describe, expect, it } from 'vitest';
import { predictions } from '../../src/playground/refQuiz.js';

const actual = {
  sharedReference: (() => {
    const a = { x: 1 };
    const b = a;
    b.x = 2;
    return a.x;
  })(),
  shallowArrayCopy: (() => {
    const arr = [1, 2];
    const copy = [...arr];
    copy.push(3);
    return arr.length;
  })(),
  shallowNestedCopy: (() => {
    const a = { n: { v: 1 } };
    const b = { ...a };
    b.n.v = 2;
    return a.n.v;
  })(),
  objectIsNaN: Object.is(NaN, NaN),
  objectIsNegativeZero: Object.is(0, -0),
  structuredCloneDeep: (() => {
    const a = { n: { v: 1 } };
    const b = structuredClone(a);
    b.n.v = 2;
    return a.n.v;
  })(),
};

describe('references quiz', () => {
  for (const [key, value] of Object.entries(actual)) {
    it(`predicts ${key}`, () => {
      expect(predictions[key], `predictions.${key} не совпал`).toEqual(value);
    });
  }
});
