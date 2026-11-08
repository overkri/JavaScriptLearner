import { describe, expect, it, vi } from 'vitest';
import { Store } from '../../src/core/Store.js';

describe('Store', () => {
  it('stores the initial state', () => {
    const initial = { count: 0 };
    const store = new Store(initial);
    expect(store.getState()).toBe(initial);
    expect(store.size).toBe(1);
    expect(new Store().getState()).toEqual({});
  });

  it('merges patches immutably', () => {
    const store = new Store({ count: 0, theme: 'light' });
    const previous = store.getState();
    const next = store.setState({ count: 1 });

    expect(next).not.toBe(previous);
    expect(next).toEqual({ count: 1, theme: 'light' });
    expect(previous).toEqual({ count: 0, theme: 'light' });
    expect(store.getState()).toBe(next);
  });

  it('notifies subscribers with next and previous states', () => {
    const store = new Store({ count: 0 });
    const listener = vi.fn();
    store.subscribe(listener);
    const previous = store.getState();
    store.setState({ count: 1 });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({ count: 1 }, previous);
  });

  it('does not notify when values did not change', () => {
    const store = new Store({ count: 0 });
    const listener = vi.fn();
    store.subscribe(listener);
    const before = store.getState();
    const after = store.setState({ count: 0 });
    expect(after).toBe(before);
    expect(listener).not.toHaveBeenCalled();
  });

  it('stops notifying after unsubscribe', () => {
    const store = new Store({ count: 0 });
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.setState({ count: 1 });
    unsubscribe();
    store.setState({ count: 2 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('creates a store with from()', () => {
    const store = Store.from({ tasks: [] });
    expect(store).toBeInstanceOf(Store);
    expect(store.getState()).toEqual({ tasks: [] });
  });

  it('updates size when keys are added', () => {
    const store = new Store({ a: 1 });
    store.setState({ b: 2 });
    expect(store.size).toBe(2);
  });
});
