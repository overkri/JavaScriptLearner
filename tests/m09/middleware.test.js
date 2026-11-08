import { afterEach, describe, expect, it, vi } from 'vitest';
import { asyncThunk, logger, persist } from '../../src/state/middleware.js';
import { createStore } from '../../src/state/store.js';

/** @type {(state: any, action: any) => any} */
function reducer(state = { count: 0 }, action) {
  if (action.type === 'INCREMENT') return { count: state.count + 1 };
  return state;
}

/** @returns {StorageLike & { data: Map<string, string> }} */
function memoryStorage() {
  const data = new Map();
  return {
    data,
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('logger', () => {
  it('logs before and after the action', () => {
    const group = vi.spyOn(console, 'group').mockImplementation(() => {});
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const end = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

    const store = createStore(reducer, { count: 0 }, [logger]);
    store.dispatch({ type: 'INCREMENT' });

    expect(group).toHaveBeenCalledTimes(1);
    expect(group.mock.calls[0][0]).toContain('INCREMENT');
    expect(log).toHaveBeenCalledTimes(2);
    expect(log.mock.calls[0][1]).toEqual({ count: 0 });
    expect(log.mock.calls[1][1]).toEqual({ count: 1 });
    expect(end).toHaveBeenCalledTimes(1);
  });
});

describe('persist', () => {
  it('writes the new state after dispatch', () => {
    const storage = memoryStorage();
    const store = createStore(reducer, { count: 0 }, [persist('app', storage)]);

    store.dispatch({ type: 'INCREMENT' });
    expect(JSON.parse(storage.getItem('app'))).toEqual({ count: 1 });
  });

  it('does not throw when storage fails', () => {
    const storage = {
      ...memoryStorage(),
      setItem: () => {
        throw new Error('quota');
      },
    };
    const store = createStore(reducer, { count: 0 }, [persist('app', storage)]);
    expect(() => store.dispatch({ type: 'INCREMENT' })).not.toThrow();
  });
});

describe('asyncThunk', () => {
  it('runs function actions with dispatch and getState', () => {
    const store = createStore(reducer, { count: 0 }, [asyncThunk]);

    const result = store.dispatch((dispatch, getState) => {
      dispatch({ type: 'INCREMENT' });
      dispatch({ type: 'INCREMENT' });
      return getState().count;
    });

    expect(result).toBe(2);
    expect(store.getState()).toEqual({ count: 2 });
  });

  it('passes object actions to the next middleware', () => {
    const store = createStore(reducer, { count: 0 }, [asyncThunk]);
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toEqual({ count: 1 });
  });
});
