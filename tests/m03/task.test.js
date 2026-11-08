import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTask, isOverdue, updateTask } from '../../src/domain/task.js';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 5, 1, 10, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('createTask', () => {
  it('creates a task with defaults and a generated id', () => {
    const task = createTask({ title: '  Купить   молоко ' });
    expect(task.title).toBe('Купить молоко');
    expect(task.description).toBe('');
    expect(task.priority).toBe('medium');
    expect(task.status).toBe('todo');
    expect(task.tags).toEqual([]);
    expect(task.dueDate).toBeNull();
    expect(task.id).toMatch(/[0-9a-f-]{36}/i);
    expect(task.createdAt).toBe(task.updatedAt);
    expect(task.createdAt).toBe(new Date(2026, 5, 1, 10, 0, 0).toISOString());
  });

  it('normalizes tags: lowercase, trimmed, unique, without empty values', () => {
    const task = createTask({
      title: 'Task',
      tags: ['Work', ' work ', 'HOME', '', '  '],
    });
    expect(task.tags).toEqual(['work', 'home']);
  });

  it('creates different ids for different tasks', () => {
    expect(createTask({ title: 'One' }).id).not.toBe(createTask({ title: 'Two' }).id);
  });

  it('rejects invalid input', () => {
    expect(() => createTask({ title: '   ' })).toThrow();
    expect(() => createTask({ title: 'x'.repeat(81) })).toThrow();
    expect(() => createTask({ title: 'Ok', priority: 'urgent' })).toThrow();
    expect(() => createTask({ title: 'Ok', dueDate: '2026-02-30' })).toThrow();
  });
});

describe('updateTask', () => {
  it('returns a new object without mutating the original', () => {
    const original = createTask({ title: 'Old', tags: ['work'] });
    vi.advanceTimersByTime(1000);
    const updated = updateTask(original, { title: 'New', priority: 'high' });

    expect(updated).not.toBe(original);
    expect(updated.title).toBe('New');
    expect(updated.priority).toBe('high');
    expect(updated.tags).toEqual(['work']);
    expect(updated.id).toBe(original.id);
    expect(updated.createdAt).toBe(original.createdAt);
    expect(updated.updatedAt).not.toBe(original.updatedAt);
    expect(original.title).toBe('Old');
    expect(original.priority).toBe('medium');
  });

  it('normalizes tags in a patch', () => {
    const task = createTask({ title: 'Task' });
    expect(updateTask(task, { tags: ['A', 'a', 'B'] }).tags).toEqual(['a', 'b']);
  });

  it('validates patched fields', () => {
    const task = createTask({ title: 'Task' });
    expect(() => updateTask(task, { title: ' ' })).toThrow();
    expect(() => updateTask(task, { status: 'archived' })).toThrow();
    expect(() => updateTask(task, { priority: 'urgent' })).toThrow();
    expect(() => updateTask(task, { dueDate: '01.01.2027' })).toThrow();
  });
});

describe('isOverdue', () => {
  const now = new Date(2026, 5, 2, 12, 0, 0);

  it('is true when the due date has passed', () => {
    const task = createTask({ title: 'Task', dueDate: '2026-06-01' });
    expect(isOverdue(task, now)).toBe(true);
  });

  it('is false on the due date itself and for tasks without a due date', () => {
    expect(isOverdue(createTask({ title: 'Task', dueDate: '2026-06-02' }), now)).toBe(false);
    expect(isOverdue(createTask({ title: 'Task' }), now)).toBe(false);
  });

  it('is false for completed tasks even if the date has passed', () => {
    const task = { ...createTask({ title: 'Task', dueDate: '2026-06-01' }), status: 'done' };
    expect(isOverdue(task, now)).toBe(false);
  });
});
