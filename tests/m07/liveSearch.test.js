import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createLiveSearch } from '../../src/features/search/liveSearch.js';

/**
 * @typedef {{ resolve: (value: any) => void, reject: (error: any) => void, signal: AbortSignal }} Deferred
 */

/** @returns {{ search: ReturnType<typeof vi.fn>, deferred: Map<string, Deferred> }} */
function makeSearch() {
  /** @type {Map<string, Deferred>} */
  const deferred = new Map();
  const search = vi.fn((query, signal) => {
    return new Promise((resolve, reject) => {
      deferred.set(query, { resolve, reject, signal });
    });
  });
  return { search, deferred };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('createLiveSearch', () => {
  it('debounces the search call', async () => {
    const { search } = makeSearch();
    const live = createLiveSearch({ search, delay: 100 });

    live.search('a');
    await vi.advanceTimersByTimeAsync(99);
    expect(search).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(search).toHaveBeenCalledTimes(1);
    expect(search.mock.calls[0][0]).toBe('a');
    expect(search.mock.calls[0][1]).toBeInstanceOf(AbortSignal);
  });

  it('delivers results with the query', async () => {
    const { search, deferred } = makeSearch();
    const onResults = vi.fn();
    const live = createLiveSearch({ search, onResults, delay: 100 });

    live.search('a');
    await vi.advanceTimersByTimeAsync(100);
    deferred.get('a').resolve(['A']);
    await Promise.resolve();
    await Promise.resolve();

    expect(onResults).toHaveBeenCalledWith(['A'], 'a');
  });

  it('aborts the previous request and ignores its stale result', async () => {
    const { search, deferred } = makeSearch();
    const onResults = vi.fn();
    const live = createLiveSearch({ search, onResults, delay: 100 });

    live.search('a');
    await vi.advanceTimersByTimeAsync(100);
    const first = deferred.get('a');

    live.search('b');
    await vi.advanceTimersByTimeAsync(100);
    const second = deferred.get('b');

    expect(first.signal.aborted).toBe(true);
    expect(second.signal.aborted).toBe(false);

    second.resolve(['B']);
    await Promise.resolve();
    await Promise.resolve();
    expect(onResults).toHaveBeenCalledWith(['B'], 'b');

    first.resolve(['A']);
    await Promise.resolve();
    await Promise.resolve();
    expect(onResults).toHaveBeenCalledTimes(1);
  });

  it('reports errors of the latest request only', async () => {
    const { search, deferred } = makeSearch();
    const onError = vi.fn();
    const live = createLiveSearch({ search, onError, delay: 100 });

    live.search('a');
    await vi.advanceTimersByTimeAsync(100);
    const error = new Error('network');
    deferred.get('a').reject(error);
    await Promise.resolve();
    await Promise.resolve();
    expect(onError).toHaveBeenCalledWith(error, 'a');
  });

  it('does not report AbortError', async () => {
    const { search, deferred } = makeSearch();
    const onError = vi.fn();
    const live = createLiveSearch({ search, onError, delay: 100 });

    live.search('a');
    await vi.advanceTimersByTimeAsync(100);
    live.cancel();
    deferred.get('a').reject(new DOMException('Aborted', 'AbortError'));
    await Promise.resolve();
    await Promise.resolve();
    expect(onError).not.toHaveBeenCalled();
  });

  it('cancel prevents a pending debounced call', async () => {
    const { search } = makeSearch();
    const live = createLiveSearch({ search, delay: 100 });

    live.search('a');
    await vi.advanceTimersByTimeAsync(50);
    live.cancel();
    await vi.advanceTimersByTimeAsync(200);
    expect(search).not.toHaveBeenCalled();
  });

  it('cancel aborts the in-flight request', async () => {
    const { search, deferred } = makeSearch();
    const onResults = vi.fn();
    const live = createLiveSearch({ search, onResults, delay: 100 });

    live.search('a');
    await vi.advanceTimersByTimeAsync(100);
    live.cancel();
    expect(deferred.get('a').signal.aborted).toBe(true);

    deferred.get('a').resolve(['A']);
    await Promise.resolve();
    await Promise.resolve();
    expect(onResults).not.toHaveBeenCalled();
  });
});
