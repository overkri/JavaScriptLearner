import { describe, expect, it } from 'vitest';
import {
  createLexicalThisCounter,
  predictions,
} from '../../src/playground/thisArrowQuiz.js';

const actual = {
  regularMethodCall: (() => {
    const obj = {
      name: 'obj',
      getName() {
        return this.name;
      },
    };
    return obj.getName();
  })(),
  arrowCapturesOuterThis: (() => {
    const obj = {
      name: 'outer',
      make() {
        return () => this.name;
      },
    };
    return obj.make()();
  })(),
  arrowHasNoArguments: (function (a, b) {
    void a;
    void b;
    const inner = () => arguments.length;
    return inner();
  })(1, 2),
  arrowCannotBeNew: (() => {
    try {
      new (() => {})();
      return false;
    } catch (error) {
      return error instanceof TypeError;
    }
  })(),
};

describe('this/arrow quiz predictions', () => {
  for (const [key, value] of Object.entries(actual)) {
    it(`predicts ${key}`, () => {
      expect(predictions[key], `predictions.${key} не совпал`).toEqual(value);
    });
  }
});

describe('createLexicalThisCounter', () => {
  it('uses lexical this inside the arrow', () => {
    const counter = createLexicalThisCounter();
    expect(counter.run()).toBe(3);
    expect(counter.count).toBe(3);
  });
});
