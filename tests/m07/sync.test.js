import { describe, expect, it, vi } from 'vitest';
import { loadInitialData, optimisticUpdate } from '../../src/api/sync.js';
import { Store } from '../../src/core/Store.js';

describe('loadInitialData', () => {
  it('returns tasks and settings on success', async () => {
    const result = await loadInitialData({
      fetchTasksFn: vi.fn().mockResolvedValue([{ id: 't1' }]),
      fetchSettingsFn: vi.fn().mockResolvedValue({ locale: 'ru-RU' }),
    });
    expect(result.tasks).toEqual([{ id: 't1' }]);
    expect(result.settings).toEqual({ locale: 'ru-RU' });
    expect(result.errors).toEqual({ tasks: null, settings: null });
  });

  it('keeps partial results with allSettled', async () => {
    const failure = new Error('settings failed');
    const result = await loadInitialData({
      fetchTasksFn: vi.fn().mockResolvedValue([{ id: 't1' }]),
      fetchSettingsFn: vi.fn().mockRejectedValue(failure),
    });
    expect(result.tasks).toHaveLength(1);
    expect(result.settings).toBeNull();
    expect(result.errors.tasks).toBeNull();
    expect(result.errors.settings).toBe(failure);
  });

  it('falls back to empty tasks when tasks fail', async () => {
    const failure = new Error('tasks failed');
    const result = await loadInitialData({
      fetchTasksFn: vi.fn().mockRejectedValue(failure),
      fetchSettingsFn: vi.fn().mockResolvedValue({ locale: 'ru-RU' }),
    });
    expect(result.tasks).toEqual([]);
    expect(result.errors.tasks).toBe(failure);
    expect(result.settings).toEqual({ locale: 'ru-RU' });
  });

  it('handles a loader that throws synchronously', async () => {
    const failure = new Error('sync failure');
    const result = await loadInitialData({
      fetchTasksFn: () => {
        throw failure;
      },
      fetchSettingsFn: () => ({ locale: 'ru-RU' }),
    });
    expect(result.tasks).toEqual([]);
    expect(result.errors.tasks).toBe(failure);
    expect(result.settings).toEqual({ locale: 'ru-RU' });
    expect(result.errors.settings).toBeNull();
  });
});

describe('optimisticUpdate', () => {
  it('applies the optimistic patch immediately and returns the API result', async () => {
    const store = new Store({ tasks: [] });
    const apiCall = vi.fn().mockResolvedValue({ id: 't1' });

    const promise = optimisticUpdate(
      store,
      (state) => ({ tasks: [...state.tasks, { id: 't1' }] }),
      apiCall,
      { notify: vi.fn() },
    );

    // Изменение видно до завершения запроса.
    expect(store.getState().tasks).toHaveLength(1);

    await expect(promise).resolves.toEqual({ id: 't1' });
    expect(store.getState().tasks).toHaveLength(1);
    expect(apiCall).toHaveBeenCalledTimes(1);
  });

  it('rolls back and notifies on failure', async () => {
    const store = new Store({ tasks: [{ id: 'old' }] });
    const previous = store.getState();
    const failure = new Error('save failed');
    const notify = vi.fn();

    const promise = optimisticUpdate(
      store,
      (state) => ({ tasks: [...state.tasks, { id: 'new' }] }),
      vi.fn().mockRejectedValue(failure),
      { notify },
    );

    expect(store.getState().tasks).toHaveLength(2);
    await expect(promise).rejects.toBe(failure);

    expect(store.getState()).toEqual(previous);
    expect(store.getState().tasks).toBe(previous.tasks);
    expect(notify).toHaveBeenCalledWith(expect.stringContaining('save failed'), {
      type: 'error',
    });
  });
});
