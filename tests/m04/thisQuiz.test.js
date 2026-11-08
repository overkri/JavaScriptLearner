import { describe, expect, it } from 'vitest';
import {
  bindMethods,
  createBoundCounter,
  predictions,
} from '../../src/playground/thisQuiz.js';

/** @returns {{ name: string, getName: () => string|undefined }} */
function makeObject() {
  return {
    name: 'obj',
    getName() {
      return this?.name;
    },
  };
}

const actual = {
  methodCall: makeObject().getName(),
  detachedCallback: (() => {
    const fn = makeObject().getName;
    return String(fn());
  })(),
  boundMethod: (() => {
    const obj = makeObject();
    return obj.getName.bind(obj)();
  })(),
  callChangesThis: makeObject().getName.call({ name: 'other' }),
  arrowInMethod: (() => {
    const obj = {
      name: 'obj',
      read() {
        return (() => this?.name)();
      },
    };
    return obj.read();
  })(),
};

describe('this quiz predictions', () => {
  for (const [key, value] of Object.entries(actual)) {
    it(`predicts ${key}`, () => {
      expect(predictions[key], `predictions.${key} не совпал`).toEqual(value);
    });
  }
});

describe('createBoundCounter', () => {
  it('keeps this when the method is detached', () => {
    const counter = createBoundCounter();
    const { increment } = counter;
    expect(increment()).toBe(1);
    expect(increment()).toBe(2);
    expect(counter.value).toBe(2);
  });
});

describe('bindMethods', () => {
  it('binds the requested methods to the original object', () => {
    const obj = {
      name: 'TaskFlow',
      greet(greeting) {
        return `${greeting}, ${this.name}!`;
      },
      other() {
        return this === obj;
      },
    };
    const bound = bindMethods(obj, 'greet');
    const { greet } = bound;
    expect(greet('Привет')).toBe('Привет, TaskFlow!');
    expect(bindMethods(obj, 'other').other()).toBe(true);
  });
});
