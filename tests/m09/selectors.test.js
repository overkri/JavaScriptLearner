import { describe, expect, it, vi } from 'vitest';
import {
  createSelector,
  selectStats,
  selectTags,
  selectVisibleTasks,
} from '../../src/state/selectors.js';

/** @param {Record<string, any>} overrides */
function makeTask(overrides = {}) {
  return {
    id: 't1',
    title: 'Task',
    description: '',
    status: 'todo',
    priority: 'medium',
    tags: ['work'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    dueDate: null,
    ...overrides,
  };
}

const state = {
  tasks: [
    makeTask({ id: 't1', title: 'First', tags: ['work'] }),
    makeTask({ id: 't2', title: 'Second', status: 'done', tags: ['home'] }),
  ],
  filter: { status: 'all', priority: 'all', tag: null, text: '' },
};

describe('createSelector', () => {
  it('memoizes the last input set', () => {
    const input = vi.fn((value) => value);
    const resultFn = vi.fn((value) => value * 2);
    const selector = createSelector(input, resultFn);

    expect(selector(2)).toBe(4);
    expect(selector(2)).toBe(4);
    expect(resultFn).toHaveBeenCalledTimes(1);

    expect(selector(3)).toBe(6);
    expect(resultFn).toHaveBeenCalledTimes(2);
  });

  it('supports several input selectors', () => {
    const resultFn = vi.fn((a, b) => a + b);
    const selector = createSelector(
      (obj) => obj.a,
      (obj) => obj.b,
      resultFn,
    );
    expect(selector({ a: 1, b: 2 })).toBe(3);
    expect(selector({ a: 1, b: 2 })).toBe(3);
    expect(resultFn).toHaveBeenCalledTimes(1);
  });
});

describe('selectVisibleTasks', () => {
  it('filters tasks and returns a stable reference for the same state', () => {
    const filtered = { ...state, filter: { ...state.filter, status: 'done' } };
    const first = selectVisibleTasks(filtered);
    const second = selectVisibleTasks(filtered);
    expect(first.map((task) => task.id)).toEqual(['t2']);
    expect(second).toBe(first);
  });

  it('recomputes when the filter changes', () => {
    const todo = { ...state, filter: { ...state.filter, status: 'todo' } };
    expect(selectVisibleTasks(todo).map((task) => task.id)).toEqual(['t1']);
  });
});

describe('selectStats', () => {
  it('returns memoized stats', () => {
    const first = selectStats(state);
    const second = selectStats(state);
    expect(first.total).toBe(2);
    expect(first.byStatus.done).toBe(1);
    expect(second).toBe(first);
  });
});

describe('selectTags', () => {
  it('returns a memoized Set of tags', () => {
    const first = selectTags(state);
    const second = selectTags(state);
    expect(first).toBeInstanceOf(Set);
    expect([...first].sort()).toEqual(['home', 'work']);
    expect(second).toBe(first);
  });
});
