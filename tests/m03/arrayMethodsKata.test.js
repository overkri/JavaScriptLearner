import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  allDone,
  doubleAll,
  findTaskByTitle,
  flattenTags,
  hasOverdue,
  indexOfPriority,
  insertAt,
  lastTag,
  onlyEven,
  sortedNumbers,
  sum,
} from '../../src/playground/arrayMethodsKata.js';

/** @param {Record<string, any>} overrides */
function makeTask(overrides = {}) {
  return {
    id: crypto.randomUUID(),
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

const tasks = [
  makeTask({ title: 'Alpha', priority: 'low', status: 'todo', tags: ['work'], dueDate: '2020-01-01' }),
  makeTask({ title: 'Beta', priority: 'high', tags: ['home', 'js'] }),
  makeTask({ title: 'Gamma', priority: 'medium', status: 'done', tags: [] }),
];

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 5, 15, 12, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('number kata', () => {
  it('doubleAll doubles every value', () => {
    expect(doubleAll([1, 2, 3])).toEqual([2, 4, 6]);
  });

  it('onlyEven keeps even values', () => {
    expect(onlyEven([1, 2, 3, 4])).toEqual([2, 4]);
  });

  it('sum adds values and returns 0 for an empty array', () => {
    expect(sum([1, 2, 3])).toBe(6);
    expect(sum([])).toBe(0);
  });

  it('sortedNumbers sorts numerically without mutating', () => {
    const input = [10, 9, 1];
    expect(sortedNumbers(input)).toEqual([1, 9, 10]);
    expect(input).toEqual([10, 9, 1]);
  });

  it('insertAt inserts without mutating', () => {
    const input = [1, 4];
    expect(insertAt(input, 1, 2)).toEqual([1, 2, 4]);
    expect(input).toEqual([1, 4]);
  });
});

describe('task kata', () => {
  it('findTaskByTitle finds a title case-insensitively', () => {
    expect(findTaskByTitle(tasks, 'beta')?.title).toBe('Beta');
    expect(findTaskByTitle(tasks, 'missing')).toBeUndefined();
  });

  it('indexOfPriority returns the index or -1', () => {
    expect(indexOfPriority(tasks, 'high')).toBe(1);
    expect(indexOfPriority(tasks, 'urgent')).toBe(-1);
  });

  it('hasOverdue finds a past due date', () => {
    expect(hasOverdue(tasks)).toBe(true);
    expect(hasOverdue([makeTask({ dueDate: '2099-01-01' })])).toBe(false);
  });

  it('allDone is true only when every task is done', () => {
    expect(allDone(tasks)).toBe(false);
    expect(allDone(tasks.filter((task) => task.status === 'done'))).toBe(true);
    expect(allDone([])).toBe(true);
  });

  it('flattenTags flattens all tags preserving order', () => {
    expect(flattenTags(tasks)).toEqual(['work', 'home', 'js']);
  });

  it('lastTag returns the last tag or undefined', () => {
    expect(lastTag(tasks)).toBe('js');
    expect(lastTag([])).toBeUndefined();
  });
});
