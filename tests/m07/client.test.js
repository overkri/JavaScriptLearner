import { beforeEach, describe, expect, it, vi } from 'vitest';
import { request } from '../../src/api/client.js';
import { createFakeServer } from '../../src/api/fakeServer.js';
import { NotFoundError } from '../../src/core/errors.js';
import { TimeoutError } from '../../src/utils/async.js';

/** @type {ReturnType<typeof createFakeServer>} */
let server;

beforeEach(() => {
  server = createFakeServer({ latency: [0, 0], errorRate: 0 });
});

describe('request', () => {
  it('performs GET and parses JSON', async () => {
    const tasks = await request('/api/tasks', { fetchImpl: server });
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks).toHaveLength(12);
  });

  it('serializes the body and content type for POST', async () => {
    const task = await request('/api/tasks', {
      method: 'POST',
      body: { title: 'Новая', priority: 'high', tags: ['Work'] },
      fetchImpl: server,
    });
    expect(task.title).toBe('Новая');
    expect(task.priority).toBe('high');
    expect(task.tags).toEqual(['work']);
    expect(task.id).toMatch(/^task-\d+$/);
  });

  it('maps 404 to NotFoundError', async () => {
    await expect(
      request('/api/tasks/missing', { fetchImpl: server }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('maps other error statuses to NetworkError with status', async () => {
    server.configure({ errorRate: 1 });
    await expect(request('/api/tasks', { fetchImpl: server })).rejects.toMatchObject({
      name: 'NetworkError',
      status: 500,
    });
  });

  it('returns null for 204', async () => {
    const result = await request('/api/tasks/task-1', {
      method: 'DELETE',
      fetchImpl: server,
    });
    expect(result).toBeNull();
  });

  it('wraps network errors in NetworkError with cause', async () => {
    const cause = new TypeError('fetch failed');
    const fetchImpl = vi.fn().mockRejectedValue(cause);
    await expect(request('/api/tasks', { fetchImpl })).rejects.toMatchObject({
      name: 'NetworkError',
      status: 0,
      cause,
    });
  });

  it('rejects with TimeoutError when the server is too slow', async () => {
    vi.useFakeTimers();
    try {
      const fetchImpl = vi.fn(
        () =>
          new Promise(() => {
            // Никогда не резолвится.
          }),
      );
      const promise = request('/api/tasks', { fetchImpl, timeoutMs: 100 });
      const assertion = expect(promise).rejects.toBeInstanceOf(TimeoutError);
      await vi.advanceTimersByTimeAsync(100);
      await assertion;
    } finally {
      vi.useRealTimers();
    }
  });

  it('propagates AbortError', async () => {
    const controller = new AbortController();
    const fetchImpl = vi.fn(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        }),
    );

    const promise = request('/api/tasks', { fetchImpl, signal: controller.signal });
    const assertion = expect(promise).rejects.toMatchObject({ name: 'AbortError' });
    controller.abort();
    await assertion;
  });
});
