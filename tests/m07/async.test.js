import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  TimeoutError,
  promisify,
  retry,
  runParallel,
  runSequential,
  sleep,
  withTimeout,
} from '../../src/utils/async.js';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('sleep', () => {
  it('resolves after the given time', async () => {
    const spy = vi.fn();
    sleep(100).then(spy);
    expect(spy).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(100);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('withTimeout', () => {
  it('resolves when the promise wins the race', async () => {
    await expect(withTimeout(Promise.resolve('ok'), 100)).resolves.toBe('ok');
  });

  it('rejects with TimeoutError when the timer wins', async () => {
    const never = new Promise(() => {});
    const promise = withTimeout(never, 50);
    const assertion = expect(promise).rejects.toBeInstanceOf(TimeoutError);
    await vi.advanceTimersByTimeAsync(50);
    await assertion;
  });

  it('uses a custom timeout message', async () => {
    const promise = withTimeout(new Promise(() => {}), 5, 'Too slow');
    const assertion = expect(promise).rejects.toThrow('Too slow');
    await vi.advanceTimersByTimeAsync(5);
    await assertion;
  });

  it('propagates the original rejection', async () => {
    const failure = new Error('original');
    const source = Promise.reject(failure);
    source.catch(() => {});
    await expect(withTimeout(source, 100)).rejects.toBe(failure);
  });
});

describe('retry', () => {
  it('retries and returns the first successful result', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('one'))
      .mockRejectedValueOnce(new Error('two'))
      .mockResolvedValue('ok');

    const promise = retry(fn, { retries: 2, delayMs: 10, factor: 2 });
    await vi.advanceTimersByTimeAsync(100);
    await expect(promise).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('throws the last error after all attempts', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always'));
    const promise = retry(fn, { retries: 2, delayMs: 5 });
    const assertion = expect(promise).rejects.toThrow('always');
    await vi.advanceTimersByTimeAsync(100);
    await assertion;
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('stops immediately when shouldRetry returns false', async () => {
    const error = new Error('fatal');
    const fn = vi.fn().mockRejectedValue(error);
    const shouldRetry = vi.fn(() => false);

    await expect(retry(fn, { retries: 5, shouldRetry })).rejects.toBe(error);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(shouldRetry).toHaveBeenCalledTimes(1);
  });
});

describe('promisify', () => {
  it('converts an error-first callback function', async () => {
    /** @param {number} a @param {number} b @param {(err: Error|null, result?: number) => void} cb */
    function add(a, b, cb) {
      setTimeout(() => cb(null, a + b), 10);
    }
    const promise = promisify(add)(2, 3);
    await vi.advanceTimersByTimeAsync(10);
    await expect(promise).resolves.toBe(5);
  });

  it('rejects when the callback receives an error', async () => {
    /** @param {(err: Error|null) => void} cb */
    function fail(cb) {
      setTimeout(() => cb(new Error('nope')), 0);
    }
    const promise = promisify(fail)();
    const assertion = expect(promise).rejects.toThrow('nope');
    await vi.advanceTimersByTimeAsync(0);
    await assertion;
  });
});

describe('runSequential and runParallel', () => {
  it('runSequential runs tasks one by one and preserves order', async () => {
    /** @type {string[]} */
    const events = [];
    const tasks = [1, 2, 3].map((value) => async () => {
      events.push(`start-${value}`);
      await sleep(10);
      events.push(`end-${value}`);
      return value * 2;
    });

    const promise = runSequential(tasks);
    await vi.advanceTimersByTimeAsync(100);
    await expect(promise).resolves.toEqual([2, 4, 6]);
    expect(events).toEqual([
      'start-1',
      'end-1',
      'start-2',
      'end-2',
      'start-3',
      'end-3',
    ]);
  });

  it('runParallel respects the limit and keeps result order', async () => {
    let active = 0;
    let maxActive = 0;
    const tasks = [10, 20, 30, 40].map((value, index) => async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await sleep(10 + index);
      active -= 1;
      return value;
    });

    const promise = runParallel(tasks, 2);
    await vi.advanceTimersByTimeAsync(100);
    await expect(promise).resolves.toEqual([10, 20, 30, 40]);
    expect(maxActive).toBe(2);
  });

  it('runParallel handles an empty list', async () => {
    await expect(runParallel([])).resolves.toEqual([]);
  });
});
