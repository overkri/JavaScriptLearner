import { describe, expect, it } from 'vitest';
import {
  eachSeries,
  mapAsync,
  safeAsync,
  settleAll,
} from '../../src/playground/asyncPitfalls.js';

describe('mapAsync', () => {
  it('runs in parallel and preserves order', async () => {
    const result = await mapAsync([1, 2, 3], (value) => value * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  it('passes the index and starts all tasks', async () => {
    const started = [];
    /** @type {Array<() => void>} */
    const releases = [];
    const promise = mapAsync([1, 2, 3], (value, index) => {
      started.push(value);
      return new Promise((resolve) => {
        releases.push(() => resolve(index));
      });
    });

    await Promise.resolve();
    expect(started).toEqual([1, 2, 3]);
    releases.forEach((release) => release());
    await expect(promise).resolves.toEqual([0, 1, 2]);
  });
});

describe('eachSeries', () => {
  it('runs tasks sequentially', async () => {
    const events = [];
    const result = await eachSeries([1, 2, 3], async (value) => {
      events.push(`start-${value}`);
      await Promise.resolve();
      events.push(`end-${value}`);
      return value * 10;
    });
    expect(result).toEqual([10, 20, 30]);
    expect(events).toEqual([
      'start-1',
      'end-1',
      'start-2',
      'end-2',
      'start-3',
      'end-3',
    ]);
  });
});

describe('settleAll', () => {
  it('returns fulfilled and rejected results', async () => {
    const error = new Error('no');
    const rejected = Promise.reject(error);
    rejected.catch(() => {});
    const results = await settleAll([Promise.resolve(1), rejected]);
    expect(results[0]).toEqual({ status: 'fulfilled', value: 1 });
    expect(results[1].status).toBe('rejected');
    expect(results[1].reason).toBe(error);
  });
});

describe('safeAsync', () => {
  it('wraps a success', async () => {
    await expect(safeAsync((a, b) => a + b)(2, 3)).resolves.toEqual({
      ok: true,
      value: 5,
    });
  });

  it('catches an error instead of rejecting', async () => {
    const error = new Error('boom');
    await expect(
      safeAsync(() => Promise.reject(error))(),
    ).resolves.toEqual({ ok: false, error });
  });
});
