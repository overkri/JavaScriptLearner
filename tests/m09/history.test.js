import { beforeEach, describe, expect, it } from 'vitest';
import { canRedo, canUndo, withHistory } from '../../src/state/history.js';

/** @type {(state: number|undefined, action: { type: string, value?: number }) => number} */
function counter(state = 0, action) {
  if (action.type === 'INCREMENT') return state + (action.value ?? 1);
  return state;
}

/** @type {ReturnType<typeof withHistory>} */
let reducer;

beforeEach(() => {
  reducer = withHistory(counter, { limit: 5 });
});

/** @param {number} times @param {number} [value] */
function increment(history, times, value = 1) {
  let state = history ?? reducer(undefined, { type: '@@INIT' });
  for (let index = 0; index < times; index += 1) {
    state = reducer(state, { type: 'INCREMENT', value });
  }
  return state;
}

describe('withHistory', () => {
  it('initializes history around the initial reducer state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({ past: [], present: 0, future: [] });
    expect(canUndo(state)).toBe(false);
    expect(canRedo(state)).toBe(false);
  });

  it('records past states and undoes them', () => {
    let state = increment(undefined, 2);
    expect(state.present).toBe(2);
    expect(state.past).toEqual([0, 1]);
    expect(canUndo(state)).toBe(true);

    state = reducer(state, { type: 'UNDO' });
    expect(state.present).toBe(1);
    expect(state.past).toEqual([0]);
    expect(state.future).toEqual([2]);
    expect(canRedo(state)).toBe(true);

    state = reducer(state, { type: 'UNDO' });
    expect(state.present).toBe(0);
    expect(canUndo(state)).toBe(false);
  });

  it('redoes states', () => {
    let state = increment(undefined, 1);
    state = reducer(state, { type: 'UNDO' });
    state = reducer(state, { type: 'REDO' });
    expect(state.present).toBe(1);
    expect(state.past).toEqual([0]);
    expect(state.future).toEqual([]);
  });

  it('clears future after a new action', () => {
    let state = increment(undefined, 2);
    state = reducer(state, { type: 'UNDO' });
    expect(state.future).toHaveLength(1);
    state = increment(state, 1, 10);
    expect(state.present).toBe(11);
    expect(state.future).toEqual([]);
    expect(canRedo(state)).toBe(false);
  });

  it('respects the limit', () => {
    const state = increment(undefined, 10);
    expect(state.past).toHaveLength(5);
    expect(state.past).toEqual([5, 6, 7, 8, 9]);
    expect(state.present).toBe(10);
  });

  it('returns the same state when undo or redo is impossible', () => {
    const initial = reducer(undefined, { type: '@@INIT' });
    expect(reducer(initial, { type: 'UNDO' })).toBe(initial);
    expect(reducer(initial, { type: 'REDO' })).toBe(initial);
  });

  it('does not record unchanged states', () => {
    const initial = reducer(undefined, { type: '@@INIT' });
    expect(reducer(initial, { type: 'UNKNOWN' })).toBe(initial);
  });
});
