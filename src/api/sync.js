/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 7 · УПРАЖНЕНИЕ 7.4 — Загрузка и оптимистичные обновления
 * ═══════════════════════════════════════════════════════════
 *  Тема:           Promise.allSettled, откат состояния, toast
 *  Java-аналогия:  сага/компенсация: при ошибке возвращаем прежнее состояние
 *  Тесты:          npx vitest run tests/m07/sync.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  1. loadInitialData({ fetchTasksFn, fetchSettingsFn }) запускает оба
 *     запроса через Promise.allSettled (не Promise.all!) и возвращает
 *     { tasks, settings, errors: { tasks, settings } }.
 *     Частичный успех — норма: упавшие данные заменяются на [] / null,
 *     причина попадает в errors.
 *  2. optimisticUpdate(store, optimisticFn, apiCall, { notify }):
 *     - optimisticFn(state) возвращает patch; store.setState(patch)
 *       применяется СРАЗУ (до await apiCall);
 *     - при ошибке apiCall: откатить прежнее состояние, вызвать
 *       notify(message, { type: 'error' }) и пробросить ошибку;
 *     - при успехе вернуть результат apiCall, состояние остаётся
 *       оптимистичным.
 *     notify по умолчанию — showToast из ui/Toast.js.
 *
 *  ПОДСКАЗКА
 *  const previous = store.getState();
 *  store.setState(optimisticFn(previous));
 *  try { return await apiCall(); } catch (error) {
 *    store.setState(previous);
 *    notify(...);
 *    throw error;
 *  }
 *
 *  ЛОВУШКА
 *  Promise.all падает целиком при одной ошибке. Для «загрузить что можно»
 *  нужен allSettled.
 * ═══════════════════════════════════════════════════════════
 */

// import { fetchSettings, fetchTasks } from './taskApi.js';
// import { showToast } from '../ui/Toast.js';
// TODO 7.4: импортируйте зависимости после реализации.

/**
 * @typedef {import('../domain/task.js').Task} Task
 * @typedef {{ getState: () => any, setState: (patch: any) => any }} StoreLike
 */

/**
 * @param {{ fetchTasksFn?: () => Promise<Task[]>, fetchSettingsFn?: () => Promise<any> }} [deps]
 * @returns {Promise<{ tasks: Task[], settings: any, errors: { tasks: Error|null, settings: Error|null } }>}
 */
export function loadInitialData(deps = {}) {
  throw new Error('TODO 7.4.1: not implemented');
}

/**
 * @param {StoreLike} store
 * @param {(state: any) => any} optimisticFn
 * @param {() => Promise<any>} apiCall
 * @param {{ notify?: (message: string, options?: { type?: string }) => void }} [options]
 * @returns {Promise<any>}
 */
export function optimisticUpdate(store, optimisticFn, apiCall, options = {}) {
  throw new Error('TODO 7.4.2: not implemented');
}
