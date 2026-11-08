import { describe, expect, it } from 'vitest';
import { TaskList } from '../../src/domain/TaskList.js';

/** @param {string} id */
function task(id) {
  return {
    id,
    title: id,
    description: '',
    status: 'todo',
    priority: 'medium',
    tags: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    dueDate: null,
  };
}

describe('TaskList', () => {
  it('starts empty and reports length', () => {
    const list = new TaskList();
    expect(list.length).toBe(0);
    list.add(task('a')).add(task('b'));
    expect(list.length).toBe(2);
  });

  it('copies the input array', () => {
    const input = [task('a')];
    const list = new TaskList(input);
    input.push(task('b'));
    expect(list.length).toBe(1);
  });

  it('removes tasks by id and reports success', () => {
    const list = new TaskList([task('a'), task('b')]);
    expect(list.remove('a')).toBe(true);
    expect(list.remove('missing')).toBe(false);
    expect([...list].map((item) => item.id)).toEqual(['b']);
  });

  it('is iterable with for...of and spread', () => {
    const list = new TaskList([task('a'), task('b')]);
    const ids = [];
    for (const item of list) ids.push(item.id);
    expect(ids).toEqual(['a', 'b']);
    expect([...list]).toHaveLength(2);
  });

  it('serializes to an array through toJSON', () => {
    const list = new TaskList([task('a')]);
    expect(JSON.stringify(list)).toBe(JSON.stringify([task('a')]));
  });

  it('restores from JSON array or { tasks } object', () => {
    const fromArray = TaskList.fromJSON(JSON.stringify([task('a')]));
    expect(fromArray.length).toBe(1);

    const fromObject = TaskList.fromJSON({ tasks: [task('a'), task('b')] });
    expect(fromObject.length).toBe(2);
  });

  it('rejects invalid JSON data', () => {
    expect(() => TaskList.fromJSON({ nope: true })).toThrow(TypeError);
    expect(() => TaskList.fromJSON('{')).toThrow();
  });

  it('keeps tasks in a private field', () => {
    const list = new TaskList();
    expect(Object.getOwnPropertyNames(list)).not.toContain('tasks');
  });
});
