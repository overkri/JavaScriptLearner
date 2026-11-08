import { beforeEach, describe, expect, it } from 'vitest';
import { fakeFetch } from '../../src/api/fakeServer.js';
import {
  createTask,
  deleteTask,
  fetchSettings,
  fetchTasks,
  updateTask,
} from '../../src/api/taskApi.js';
import { NotFoundError } from '../../src/core/errors.js';

beforeEach(() => {
  fakeFetch.configure({ latency: [0, 0], errorRate: 0 });
  fakeFetch.reset();
});

describe('taskApi', () => {
  it('fetchTasks returns all seed tasks', async () => {
    const tasks = await fetchTasks();
    expect(tasks).toHaveLength(12);
    expect(tasks[0]).toHaveProperty('id');
    expect(tasks[0]).toHaveProperty('title');
  });

  it('fetchSettings returns application settings', async () => {
    await expect(fetchSettings()).resolves.toMatchObject({ locale: 'ru-RU' });
  });

  it('createTask creates and returns a task', async () => {
    const created = await createTask({ title: 'Новая задача', priority: 'high', tags: ['Work'] });
    expect(created.title).toBe('Новая задача');
    expect(created.id).toMatch(/^task-\d+$/);
    expect(created.tags).toEqual(['work']);

    const tasks = await fetchTasks();
    expect(tasks.some((task) => task.id === created.id)).toBe(true);
  });

  it('updateTask patches a task', async () => {
    const updated = await updateTask('task-1', { status: 'in-progress', title: 'Обновлено' });
    expect(updated.status).toBe('in-progress');
    expect(updated.title).toBe('Обновлено');
    expect(updated.id).toBe('task-1');
  });

  it('updateTask rejects NotFoundError without retrying', async () => {
    const started = Date.now();
    await expect(updateTask('missing', { title: 'x' })).rejects.toBeInstanceOf(NotFoundError);
    expect(Date.now() - started).toBeLessThan(500);
  });

  it('deleteTask removes a task', async () => {
    await deleteTask('task-1');
    const tasks = await fetchTasks();
    expect(tasks).toHaveLength(11);
    expect(tasks.some((task) => task.id === 'task-1')).toBe(false);
  });

  it('deleteTask rejects NotFoundError for an unknown id', async () => {
    await expect(deleteTask('missing')).rejects.toBeInstanceOf(NotFoundError);
  });
});
