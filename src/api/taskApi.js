/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 7 · УПРАЖНЕНИЕ 7.3 — API задач с retry
 * ═══════════════════════════════════════════════════════════
 *  Тема:           обёртки над request, идемпотентность, retry
 *  Java-аналогия:  Feign-клиент / репозиторий поверх HTTP
 *  Тесты:          npx vitest run tests/m07/taskApi.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  Реализуйте над request():
 *  - fetchTasks() → GET /api/tasks
 *  - fetchSettings() → GET /api/settings
 *  - createTask(data) → POST /api/tasks (БЕЗ retry: неидемпотентно)
 *  - updateTask(id, patch) → PATCH /api/tasks/:id (retry)
 *  - deleteTask(id) → DELETE /api/tasks/:id (retry)
 *  Для retry используйте retry из utils/async.js: 2 повтора,
 *  задержка 100 мс, factor 2, и не повторяйте NotFoundError.
 *
 *  ПОДСКАЗКА
 *  id в URL экранируйте encodeURIComponent.
 *
 *  ЛОВУШКА
 *  Повторять POST без ключа идемпотентности опасно: можно создать
 *  две задачи. Поэтому createTask — без retry.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {import('../domain/task.js').Task} Task
 * @typedef {Partial<Task>} TaskPatch
 */

/** @returns {Promise<Task[]>} */
export function fetchTasks() {
  throw new Error('TODO 7.3.1: not implemented');
}

/** @returns {Promise<{ theme: string, locale: string }>} */
export function fetchSettings() {
  throw new Error('TODO 7.3.2: not implemented');
}

/** @param {Partial<Task>} data @returns {Promise<Task>} */
export function createTask(data) {
  throw new Error('TODO 7.3.3: not implemented');
}

/** @param {string} id @param {TaskPatch} patch @returns {Promise<Task>} */
export function updateTask(id, patch) {
  throw new Error('TODO 7.3.4: not implemented');
}

/** @param {string} id @returns {Promise<void>} */
export function deleteTask(id) {
  throw new Error('TODO 7.3.5: not implemented');
}
