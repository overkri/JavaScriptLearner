import { describe, expect, it } from 'vitest';
import { createInitialState, reducer } from '../../src/state/reducer.js';

/** @param {Record<string, any>} overrides */
function makeTask(overrides = {}) {
  return {
    id: 't1',
    title: 'Task',
    description: '',
    status: 'todo',
    priority: 'medium',
    tags: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    dueDate: null,
    ...overrides,
  };
}

const tasks = [makeTask()];
const state = { tasks, filter: { status: 'all', priority: 'all', tag: null, text: '' } };

describe('reducer', () => {
  it('loads tasks', () => {
    const next = reducer(state, { type: 'TASKS_LOADED', tasks: [makeTask({ id: 't2' })] });
    expect(next.tasks).toHaveLength(1);
    expect(next.tasks[0].id).toBe('t2');
    expect(next.filter).toBe(state.filter);
    expect(state.tasks).toBe(tasks);
  });

  it('adds, updates, moves and removes tasks immutably', () => {
    const added = makeTask({ id: 't2' });
    const afterAdd = reducer(state, { type: 'TASK_ADDED', task: added });
    expect(afterAdd.tasks).toEqual([...tasks, added]);
    expect(state.tasks).toBe(tasks);

    const afterUpdate = reducer(afterAdd, {
      type: 'TASK_UPDATED',
      id: 't1',
      patch: { title: 'Updated' },
    });
    expect(afterUpdate.tasks[0].title).toBe('Updated');
    expect(afterUpdate.tasks[1]).toBe(added);

    const afterMove = reducer(afterUpdate, { type: 'TASK_MOVED', id: 't1', status: 'done' });
    expect(afterMove.tasks[0].status).toBe('done');

    const afterRemove = reducer(afterMove, { type: 'TASK_REMOVED', id: 't1' });
    expect(afterRemove.tasks.map((task) => task.id)).toEqual(['t2']);
    expect(afterRemove.tasks[0]).toBe(added);
  });

  it('merges filter changes', () => {
    const next = reducer(state, {
      type: 'FILTER_CHANGED',
      filter: { status: 'todo', text: 'milk' },
    });
    expect(next.filter).toEqual({
      status: 'todo',
      priority: 'all',
      tag: null,
      text: 'milk',
    });
    expect(state.filter.status).toBe('all');
  });

  it('returns the same state for unknown or malformed actions', () => {
    expect(reducer(state, { type: 'UNKNOWN' })).toBe(state);
    expect(reducer(state, {})).toBe(state);
    expect(reducer(state, undefined)).toBe(state);
  });

  it('does not mutate the state or the action', () => {
    const action = { type: 'TASK_UPDATED', id: 't1', patch: { title: 'X' } };
    const actionSnapshot = structuredClone(action);
    const stateSnapshot = structuredClone(state);
    reducer(state, action);
    expect(action).toEqual(actionSnapshot);
    expect(state).toEqual(stateSnapshot);
  });

  it('createInitialState returns a fresh empty state', () => {
    const first = createInitialState();
    const second = createInitialState();
    expect(first.tasks).toEqual([]);
    expect(first.filter).toEqual({ status: 'all', priority: 'all', tag: null, text: '' });
    expect(first).not.toBe(second);
  });
});
