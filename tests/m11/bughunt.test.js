import { describe, expect, it, vi } from 'vitest';
import { addTagToTask } from '../../src/playground/bugHunt/mutationBug.js';
import { createCounterBug } from '../../src/playground/bugHunt/lostThisBug.js';
import { createSearchBug } from '../../src/playground/bugHunt/raceBug.js';

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

describe('bug hunt 11.1 — mutation', () => {
  it('adds a tag without mutating the original task', () => {
    const original = makeTask();
    const tagsBefore = [...original.tags];

    const updated = addTagToTask(original, 'Home');

    expect(updated).not.toBe(original);
    expect(updated.tags).toEqual(['work', 'home']);
    expect(original.tags).toEqual(tagsBefore);
  });
});

describe('bug hunt 11.2 — lost this', () => {
  it('keeps working when the method is detached from the object', () => {
    const counter = createCounterBug();
    const { increment } = counter;

    expect(() => increment()).not.toThrow();
    expect(counter.state.count).toBe(1);
    expect(() => increment()).not.toThrow();
    expect(counter.state.count).toBe(2);
  });
});

describe('bug hunt 11.3 — request race', () => {
  it('ignores a stale response that arrives after a newer one', async () => {
    /** @type {Map<string, (value: any) => void>} */
    const resolvers = new Map();
    const fetchFn = (query) =>
      new Promise((resolve) => {
        resolvers.set(query, resolve);
      });
    const onResult = vi.fn();
    const search = createSearchBug(fetchFn, onResult);

    const first = search('a');
    const second = search('b');

    resolvers.get('b')(['B']);
    await second;
    resolvers.get('a')(['A']);
    await first;

    expect(onResult).toHaveBeenCalledTimes(1);
    expect(onResult).toHaveBeenCalledWith(['B'], 'b');
  });
});
