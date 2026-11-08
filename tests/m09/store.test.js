import { describe, expect, it, vi } from 'vitest';
import { createStore } from '../../src/state/store.js';

/** @type {(state: number|undefined, action: { type: string, value?: number }) => number} */
function counterReducer(state = 0, action) {
  if (action.type === 'INCREMENT') return state + (action.value ?? 1);
  return state;
}

describe('createStore', () => {
  it('returns the initial state', () => {
    const store = createStore(counterReducer, 5);
    expect(store.getState()).toBe(5);
  });

  it('dispatches actions and notifies subscribers', () => {
    const store = createStore(counterReducer, 0);
    const listener = vi.fn();
    store.subscribe(listener);

    const action = { type: 'INCREMENT' };
    expect(store.dispatch(action)).toBe(action);
    expect(store.getState()).toBe(1);
    expect(listener).toHaveBeenCalledWith(1, 0);
  });

  it('does not notify when the state reference is unchanged', () => {
    const store = createStore(counterReducer, 0);
    const listener = vi.fn();
    store.subscribe(listener);
    store.dispatch({ type: 'UNKNOWN' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('unsubscribes', () => {
    const store = createStore(counterReducer, 0);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.dispatch({ type: 'INCREMENT' });
    unsubscribe();
    store.dispatch({ type: 'INCREMENT' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('applies middleware in order', () => {
    /** @type {string[]} */
    const calls = [];
    const makeMiddleware = (name) => (store) => (next) => (action) => {
      void store;
      calls.push(`${name}:before`);
      const result = next(action);
      calls.push(`${name}:after`);
      return result;
    };

    const store = createStore(counterReducer, 0, [
      makeMiddleware('first'),
      makeMiddleware('second'),
    ]);
    store.dispatch({ type: 'INCREMENT' });
    expect(calls).toEqual([
      'first:before',
      'second:before',
      'second:after',
      'first:after',
    ]);
    expect(store.getState()).toBe(1);
  });

  it('lets middleware call store.dispatch recursively', () => {
    const store = createStore(counterReducer, 0, [
      (innerStore) => (next) => (action) => {
        if (action.type === 'DOUBLE') {
          innerStore.dispatch({ type: 'INCREMENT' });
          return innerStore.dispatch({ type: 'INCREMENT' });
        }
        return next(action);
      },
    ]);
    store.dispatch({ type: 'DOUBLE' });
    expect(store.getState()).toBe(2);
  });
});
