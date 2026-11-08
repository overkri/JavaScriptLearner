/**
 * Эталон модуля 7.4 — allSettled и оптимистичные обновления.
 */

import { showToast } from '../ui/Toast.js';
import { fetchSettings, fetchTasks } from './taskApi.js';

/**
 * @typedef {import('../domain/task.js').Task} Task
 * @typedef {{ getState: () => any, setState: (patch: any) => any }} StoreLike
 */

/**
 * @param {{ fetchTasksFn?: () => Promise<Task[]>, fetchSettingsFn?: () => Promise<any> }} [deps]
 * @returns {Promise<{ tasks: Task[], settings: any, errors: { tasks: Error|null, settings: Error|null } }>}
 */
export async function loadInitialData({
  fetchTasksFn = fetchTasks,
  fetchSettingsFn = fetchSettings,
} = {}) {
  const [tasksResult, settingsResult] = await Promise.allSettled([
    Promise.resolve().then(() => fetchTasksFn()),
    Promise.resolve().then(() => fetchSettingsFn()),
  ]);

  return {
    tasks: tasksResult.status === 'fulfilled' ? tasksResult.value : [],
    settings: settingsResult.status === 'fulfilled' ? settingsResult.value : null,
    errors: {
      tasks: tasksResult.status === 'rejected' ? tasksResult.reason : null,
      settings: settingsResult.status === 'rejected' ? settingsResult.reason : null,
    },
  };
}

/**
 * @param {StoreLike} store
 * @param {(state: any) => any} optimisticFn
 * @param {() => Promise<any>} apiCall
 * @param {{ notify?: (message: string, options?: { type?: string }) => void }} [options]
 * @returns {Promise<any>}
 */
export async function optimisticUpdate(store, optimisticFn, apiCall, { notify = showToast } = {}) {
  const previous = store.getState();
  store.setState(optimisticFn(previous));

  try {
    return await apiCall();
  } catch (error) {
    store.setState(previous);
    notify(`Не удалось сохранить: ${/** @type {Error} */ (error).message}`, { type: 'error' });
    throw error;
  }
}
