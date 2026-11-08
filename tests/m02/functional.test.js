import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  compose,
  curry,
  debounce,
  memoize,
  not,
  once,
  partial,
  pipe,
  tap,
  throttle,
} from '../../src/utils/functional.js';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('once', () => {
  it('calls the function only once and returns the first result', () => {
    const fn = vi.fn((value) => value * 2);
    const wrapped = once(fn);
    expect(wrapped(2)).toBe(4);
    expect(wrapped(10)).toBe(4);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('preserves this and arguments', () => {
    const obj = {
      factor: 3,
      multiply: once(function (value) {
        return this.factor * value;
      }),
    };
    expect(obj.multiply(2)).toBe(6);
  });
});

describe('debounce', () => {
  it('calls the function once after the last call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);
    debounced('a');
    vi.advanceTimersByTime(100);
    debounced('b');
    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('b');
  });

  it('cancel prevents the pending call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced();
    debounced.cancel();
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();
  });

  it('preserves this', () => {
    let received = null;
    const obj = {
      value: 42,
      read: debounce(function () {
        received = this.value;
      }, 50),
    };
    obj.read();
    vi.advanceTimersByTime(50);
    expect(received).toBe(42);
  });
});

describe('throttle', () => {
  it('allows one call per interval (leading edge)', () => {
    const fn = vi.fn((value) => value);
    const throttled = throttle(fn, 100);
    expect(throttled(1)).toBe(1);
    expect(throttled(2)).toBeUndefined();
    vi.advanceTimersByTime(100);
    expect(throttled(3)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('memoize', () => {
  it('caches results by serialized arguments', () => {
    const fn = vi.fn((a, b) => a + b);
    const memoized = memoize(fn);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(memoized(2, 3)).toBe(5);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('supports a custom key function and clear()', () => {
    const fn = vi.fn((obj) => obj.value * 2);
    const memoized = memoize(fn, (obj) => String(obj.id));
    const first = { id: 1, value: 5 };
    expect(memoized(first)).toBe(10);
    expect(memoized({ id: 1, value: 999 })).toBe(10);
    memoized.clear();
    expect(memoized({ id: 1, value: 7 })).toBe(14);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('pipe and compose', () => {
  const addOne = (value) => value + 1;
  const double = (value) => value * 2;
  const toString = (value) => `#${value}`;

  it('pipe applies functions left to right', () => {
    expect(pipe(addOne, double, toString)(3)).toBe('#8');
  });

  it('compose applies functions right to left', () => {
    expect(compose(toString, double, addOne)(3)).toBe('#8');
  });

  it('pipe passes all arguments to the first function', () => {
    expect(pipe((a, b) => a + b, double)(2, 3)).toBe(10);
  });
});

describe('curry', () => {
  it('collects arguments until the function arity is reached', () => {
    const add = curry((a, b, c) => a + b + c);
    expect(add(1)(2)(3)).toBe(6);
    expect(add(1, 2)(3)).toBe(6);
    expect(add(1)(2, 3)).toBe(6);
  });
});

describe('partial, tap and not', () => {
  it('partial presets leading arguments', () => {
    const greet = (greeting, name) => `${greeting}, ${name}!`;
    expect(partial(greet, 'Привет')('Ада')).toBe('Привет, Ада!');
  });

  it('tap returns the original value', () => {
    const seen = [];
    expect(pipe(tap((value) => seen.push(value)), (value) => value * 2)(5)).toBe(10);
    expect(seen).toEqual([5]);
  });

  it('not can be used with filter', () => {
    const values = [1, 2, 3, 4];
    expect(values.filter(not((value) => value % 2 === 0))).toEqual([1, 3]);
  });
});
