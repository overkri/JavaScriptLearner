import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  addTask,
  filterTasks,
  groupByStatus,
  moveTask,
  removeTask,
  replaceTask,
  sortTasks,
  toggleTag,
} from '../../src/domain/taskOps.js';

/** @param {Record<string, any>} overrides */
function makeTask(overrides = {}) {
  return {
    id: 't1',
    title: 'Alpha',
    description: 'First task',
    status: 'todo',
    priority: 'medium',
    tags: ['work'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    dueDate: null,
    ...overrides,
  };
}

const first = makeTask({ id: 't1', title: 'Alpha', priority: 'low' });
const second = makeTask({ id: 't2', title: 'Beta', priority: 'high', tags: ['home'], dueDate: '2026-02-01' });
const third = makeTask({ id: 't3', title: 'Gamma', status: 'done', priority: 'medium' });
const tasks = [first, second, third];

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-02T00:00:00.000Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('addTask and removeTask', () => {
  it('adds a task to the end without mutating the input', () => {
    const added = makeTask({ id: 't4' });
    const result = addTask(tasks, added);
    expect(result).toHaveLength(4);
    expect(result.at(-1)).toBe(added);
    expect(tasks).toHaveLength(3);
    expect(result).not.toBe(tasks);
  });

  it('removes by id and keeps other references', () => {
    const result = removeTask(tasks, 't2');
    expect(result.map((task) => task.id)).toEqual(['t1', 't3']);
    expect(result[0]).toBe(first);
    expect(result[1]).toBe(third);
    expect(tasks).toHaveLength(3);
  });

  it('returns the original array when nothing was removed', () => {
    expect(removeTask(tasks, 'missing')).toBe(tasks);
  });
});

describe('replaceTask and moveTask', () => {
  it('replaces a task, updates updatedAt and keeps other references', () => {
    const result = replaceTask(tasks, 't1', { title: 'Alpha 2' });
    expect(result).not.toBe(tasks);
    expect(result[0]).not.toBe(first);
    expect(result[0].title).toBe('Alpha 2');
    expect(result[0].updatedAt).toBe('2026-01-02T00:00:00.000Z');
    expect(result[1]).toBe(second);
    expect(result[2]).toBe(third);
    expect(first.title).toBe('Alpha');
  });

  it('moves a task to another status', () => {
    const result = moveTask(tasks, 't3', 'in-progress');
    expect(result[2].status).toBe('in-progress');
    expect(third.status).toBe('done');
  });

  it('does not mutate frozen input', () => {
    const frozen = Object.freeze(
      tasks.map((task) => Object.freeze({ ...task, tags: Object.freeze([...task.tags]) })),
    );
    const result = replaceTask(frozen, 't1', { priority: 'high' });
    expect(result[0].priority).toBe('high');
    expect(frozen[0].priority).toBe('low');
  });
});

describe('toggleTag', () => {
  it('adds a missing tag in lowercase', () => {
    const result = toggleTag(first, ' Home ');
    expect(result.tags).toEqual(['work', 'home']);
    expect(first.tags).toEqual(['work']);
    expect(result).not.toBe(first);
    expect(result.tags).not.toBe(first.tags);
  });

  it('removes an existing tag ignoring case', () => {
    const result = toggleTag(first, 'WORK');
    expect(result.tags).toEqual([]);
    expect(first.tags).toEqual(['work']);
  });
});

describe('filterTasks', () => {
  it('filters by status, priority, tag and text together', () => {
    expect(filterTasks(tasks, { status: 'done' }).map((task) => task.id)).toEqual(['t3']);
    expect(filterTasks(tasks, { priority: 'high' }).map((task) => task.id)).toEqual(['t2']);
    expect(filterTasks(tasks, { tag: 'HOME' }).map((task) => task.id)).toEqual(['t2']);
    expect(filterTasks(tasks, { text: 'beta' }).map((task) => task.id)).toEqual(['t2']);
    expect(filterTasks(tasks, { text: 'first', priority: 'low' }).map((task) => task.id)).toEqual([
      't1',
    ]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterTasks(tasks, { status: 'done', tag: 'home' })).toEqual([]);
  });

  it('returns all tasks for an empty filter', () => {
    expect(filterTasks(tasks)).toEqual(tasks);
  });

  it('treats "all" as no filter for status and priority', () => {
    expect(filterTasks(tasks, { status: 'all', priority: 'all' })).toEqual(tasks);
  });
});

describe('sortTasks', () => {
  it('sorts by priority ascending and descending without mutation', () => {
    expect(sortTasks(tasks, 'priority').map((task) => task.id)).toEqual(['t1', 't3', 't2']);
    expect(sortTasks(tasks, 'priority', 'desc').map((task) => task.id)).toEqual(['t2', 't3', 't1']);
    expect(tasks.map((task) => task.id)).toEqual(['t1', 't2', 't3']);
  });

  it('puts tasks without a due date last in both directions', () => {
    expect(sortTasks(tasks, 'dueDate').map((task) => task.id)).toEqual(['t2', 't1', 't3']);
    expect(sortTasks(tasks, 'dueDate', 'desc').map((task) => task.id)).toEqual(['t2', 't1', 't3']);
  });

  it('is stable for equal keys', () => {
    const samePriority = tasks.map((task) => ({ ...task, priority: 'medium' }));
    expect(sortTasks(samePriority, 'priority')).toEqual(samePriority);
  });

  it('sorts titles with localeCompare', () => {
    const titles = [
      makeTask({ id: 'a', title: 'яблоко' }),
      makeTask({ id: 'b', title: 'Апельсин' }),
      makeTask({ id: 'c', title: 'банан' }),
    ];
    expect(sortTasks(titles, 'title').map((task) => task.title)).toEqual([
      'Апельсин',
      'банан',
      'яблоко',
    ]);
  });
});

describe('groupByStatus', () => {
  it('always returns all three groups in original order', () => {
    const groups = groupByStatus(tasks);
    expect(Object.keys(groups)).toEqual(['todo', 'in-progress', 'done']);
    expect(groups.todo.map((task) => task.id)).toEqual(['t1', 't2']);
    expect(groups['in-progress']).toEqual([]);
    expect(groups.done.map((task) => task.id)).toEqual(['t3']);
  });
});
