import { describe, expect, it, vi } from 'vitest';
import {
  INTERNAL,
  attachInternal,
  createPrivateStore,
  memoizeByObject,
  readInternal,
} from '../../src/playground/symbolsAndWeakMap.js';

describe('Symbol-based internal field', () => {
  it('INTERNAL is a symbol', () => {
    expect(typeof INTERNAL).toBe('symbol');
    expect(INTERNAL.description).toBe('taskflow.internal');
  });

  it('attaches a non-enumerable value', () => {
    const obj = { name: 'Task' };
    const result = attachInternal(obj, { secret: 42 });
    expect(result).toBe(obj);
    expect(readInternal(obj)).toEqual({ secret: 42 });
    expect(Object.keys(obj)).toEqual(['name']);
    expect(JSON.stringify(obj)).toBe('{"name":"Task"}');
    expect(Object.getOwnPropertySymbols({ ...obj })).not.toContain(INTERNAL);
  });
});

describe('createPrivateStore', () => {
  it('stores values per object without exposing them', () => {
    const store = createPrivateStore();
    const first = {};
    const second = {};
    store.set(first, 'one');
    store.set(second, 'two');

    expect(store.get(first)).toBe('one');
    expect(store.get(second)).toBe('two');
    expect(store.has(first)).toBe(true);
    expect(JSON.stringify(store)).toBe('{}');
    expect(Object.values(store).every((value) => typeof value === 'function')).toBe(true);
    expect(store.delete(first)).toBe(true);
    expect(store.has(first)).toBe(false);
    expect(store.delete(first)).toBe(false);
  });

  it('rejects primitives as keys (WeakMap behaviour)', () => {
    const store = createPrivateStore();
    expect(() => store.set('key', 1)).toThrow(TypeError);
  });
});

describe('memoizeByObject', () => {
  it('calls fn once per object', () => {
    const fn = vi.fn((obj) => ({ value: obj.value * 2 }));
    const memoized = memoizeByObject(fn);
    const key = { value: 21 };

    const first = memoized(key);
    const second = memoized(key);
    expect(first).toEqual({ value: 42 });
    expect(second).toBe(first);
    expect(fn).toHaveBeenCalledTimes(1);

    const other = { value: 1 };
    expect(memoized(other)).toEqual({ value: 2 });
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
