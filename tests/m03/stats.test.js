import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computeStats } from '../../src/domain/stats.js';

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
  makeTask({ status: 'todo', priority: 'high', tags: ['work', 'js'], dueDate: '2026-06-01' }),
  makeTask({ status: 'in-progress', priority: 'medium', tags: ['work'], dueDate: '2026-07-01' }),
  makeTask({ status: 'done', priority: 'high', tags: ['home'], dueDate: '2026-06-01' }),
  makeTask({ status: 'done', priority: 'low', tags: ['work', 'home'] }),
];

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 5, 15, 12, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('computeStats', () => {
  it('counts totals by status and priority', () => {
    const stats = computeStats(tasks);
    expect(stats.total).toBe(4);
    expect(stats.byStatus).toEqual({ todo: 1, 'in-progress': 1, done: 2 });
    expect(stats.byPriority).toEqual({ low: 1, medium: 1, high: 2 });
  });

  it('counts overdue tasks but ignores done tasks', () => {
    expect(computeStats(tasks).overdue).toBe(1);
  });

  it('computes completion rate', () => {
    expect(computeStats(tasks).completionRate).toBe(0.5);
  });

  it('returns the top three tags sorted by frequency and alphabetically on ties', () => {
    expect(computeStats(tasks).topTags).toEqual([
      { tag: 'work', count: 3 },
      { tag: 'home', count: 2 },
      { tag: 'js', count: 1 },
    ]);
  });

  it('returns zeros and an empty tag list for no tasks', () => {
    const stats = computeStats([]);
    expect(stats).toEqual({
      total: 0,
      byStatus: { todo: 0, 'in-progress': 0, done: 0 },
      byPriority: { low: 0, medium: 0, high: 0 },
      overdue: 0,
      completionRate: 0,
      topTags: [],
    });
  });

  it('does not mutate the input', () => {
    const frozen = Object.freeze(tasks.map((task) => Object.freeze(task)));
    expect(() => computeStats(frozen)).not.toThrow();
  });
});
