/**
 * Эталон модуля 7.3 — API задач.
 */

import { NotFoundError } from '../core/errors.js';
import { retry } from '../utils/async.js';
import { request } from './client.js';

/**
 * @typedef {import('../domain/task.js').Task} Task
 * @typedef {Partial<Task>} TaskPatch
 */

const RETRY_OPTIONS = {
  retries: 2,
  delayMs: 100,
  factor: 2,
  /** @param {unknown} error */
  shouldRetry: (error) => !(error instanceof NotFoundError),
};

/** @returns {Promise<Task[]>} */
export function fetchTasks() {
  return retry(() => request('/api/tasks'), RETRY_OPTIONS);
}

/** @returns {Promise<{ theme: string, locale: string }>} */
export function fetchSettings() {
  return retry(() => request('/api/settings'), RETRY_OPTIONS);
}

/** @param {Partial<Task>} data @returns {Promise<Task>} */
export function createTask(data) {
  return request('/api/tasks', { method: 'POST', body: data });
}

/** @param {string} id @param {TaskPatch} patch @returns {Promise<Task>} */
export function updateTask(id, patch) {
  return retry(
    () => request(`/api/tasks/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch }),
    RETRY_OPTIONS,
  );
}

/** @param {string} id @returns {Promise<void>} */
export function deleteTask(id) {
  return retry(
    () => request(`/api/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    RETRY_OPTIONS,
  );
}
