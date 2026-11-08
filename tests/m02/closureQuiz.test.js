import { describe, expect, it } from 'vitest';
import {
  createCounter,
  fixLoopWithIife,
  fixLoopWithLet,
  predictions,
} from '../../src/playground/closureQuiz.js';

/** @param {string} code */
function run(code) {
  return new Function(code)();
}

const actual = {
  varLoop: run('var fns = []; for (var i = 0; i < 3; i += 1) { fns.push(function () { return i; }); } return fns.map(function (fn) { return fn(); });'),
  letLoop: run('var fns = []; for (let i = 0; i < 3; i += 1) { fns.push(function () { return i; }); } return fns.map(function (fn) { return fn(); });'),
};

describe('closure quiz predictions', () => {
  for (const [key, value] of Object.entries(actual)) {
    it(`predicts ${key}`, () => {
      expect(predictions[key], `predictions.${key} не совпал`).toEqual(value);
    });
  }
});

describe('createCounter', () => {
  it('increments, decrements and resets', () => {
    const counter = createCounter(5);
    expect(counter.value).toBe(5);
    expect(counter.increment()).toBe(6);
    expect(counter.increment()).toBe(7);
    expect(counter.decrement()).toBe(6);
    expect(counter.reset()).toBe(5);
  });

  it('keeps counters independent', () => {
    const first = createCounter();
    const second = createCounter(10);
    first.increment();
    expect(first.value).toBe(1);
    expect(second.value).toBe(10);
  });
});

describe('loop fixes', () => {
  it('fixLoopWithLet returns [0, 1, 2]', () => {
    expect(fixLoopWithLet()).toEqual([0, 1, 2]);
  });

  it('fixLoopWithIife returns [0, 1, 2]', () => {
    expect(fixLoopWithIife()).toEqual([0, 1, 2]);
  });
});
