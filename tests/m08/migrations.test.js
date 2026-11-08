import { describe, expect, it } from 'vitest';
import { migrate } from '../../src/storage/migrations.js';

const baseTask = {
  id: 't1',
  title: 'Task',
  status: 'todo',
  priority: 'medium',
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('migrate', () => {
  it('migrates v1 through v2 to v3', () => {
    const input = {
      version: 1,
      tasks: [{ ...baseTask, dueDate: '2026-12-01' }],
    };
    const result = migrate(input);
    expect(result.version).toBe(3);
    expect(result.tasks[0].tags).toEqual([]);
    expect(result.tasks[0].dueDate).toBe('2026-12-01');
    expect(result.tasks[0].updatedAt).toBe(baseTask.createdAt);
  });

  it('converts v2 timestamps to ISO dates and normalizes tags', () => {
    const timestamp = Date.UTC(2026, 11, 1);
    const input = {
      version: 2,
      tasks: [{ ...baseTask, tags: ['Work', ' work ', 'HOME', ''], dueDate: timestamp }],
    };
    const result = migrate(input);
    expect(result.version).toBe(3);
    expect(result.tasks[0].tags).toEqual(['work', 'home']);
    expect(result.tasks[0].dueDate).toBe('2026-12-01');
    expect(result.tasks[0].updatedAt).toBe(baseTask.createdAt);
  });

  it('keeps a missing due date as null', () => {
    const result = migrate({ version: 1, tasks: [baseTask] });
    expect(result.tasks[0].dueDate).toBeNull();
  });

  it('treats a missing version as v1', () => {
    const result = migrate({ tasks: [baseTask] });
    expect(result.version).toBe(3);
    expect(result.tasks[0].tags).toEqual([]);
  });

  it('is idempotent', () => {
    const once = migrate({ version: 1, tasks: [{ ...baseTask, dueDate: '2026-12-01' }] });
    const twice = migrate(once);
    expect(twice).toEqual(once);
  });

  it('does not mutate the input', () => {
    const input = { version: 1, tasks: [{ ...baseTask, dueDate: '2026-12-01' }] };
    const snapshot = structuredClone(input);
    migrate(input);
    expect(input).toEqual(snapshot);
  });

  it('returns a copy for an already current version', () => {
    const input = {
      version: 3,
      tasks: [{ ...baseTask, tags: ['a'], dueDate: null, updatedAt: baseTask.createdAt }],
    };
    const result = migrate(input);
    expect(result).toEqual(input);
    expect(result).not.toBe(input);
    expect(result.tasks).not.toBe(input.tasks);
  });

  it('rejects unknown versions', () => {
    expect(() => migrate({ version: 0, tasks: [] })).toThrow();
    expect(() => migrate({ version: 4, tasks: [] })).toThrow();
    expect(() => migrate({ version: 99, tasks: [] })).toThrow();
  });

  it('rejects non-objects', () => {
    expect(() => migrate(null)).toThrow(TypeError);
    expect(() => migrate([])).toThrow(TypeError);
  });
});
