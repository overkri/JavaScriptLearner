/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 3 · УПРАЖНЕНИЕ 3.1 — Фабрика задач
 * ═══════════════════════════════════════════════════════════
 *  Тема:           деструктуризация, defaults, нормализация, Date
 *  Java-аналогия:  record Task + статическая фабрика + валидация
 *  Тесты:          npx vitest run tests/m03/task.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  1. createTask({ title, description = '', priority = 'medium',
 *     tags = [], dueDate = null }) создаёт задачу со статусом 'todo',
 *     уникальным id, createdAt/updatedAt (ISO) и нормализованными тегами
 *     (lowercase, trim, без дублей и пустых строк).
 *     Невалидный title/priority/dueDate → Error.
 *  2. updateTask(task, patch) возвращает НОВЫЙ объект: применяет patch,
 *     сохраняет id и createdAt, меняет updatedAt, не мутирует task.
 *  3. isOverdue(task, now = new Date()) — true, если dueDate уже прошёл
 *     и задача не в статусе 'done'. Задачи без дедлайна — false.
 *
 *  ПОДСКАЗКИ
 *  - Используйте validateTitle/validateDueDate из utils/validators.js.
 *  - Для уникальности тегов: new Set(tags.map(t => t.trim().toLowerCase())).
 *  - Дедлайн — строка YYYY-MM-DD; конец дня можно собрать как
 *    new Date(`${dueDate}T23:59:59.999`).
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {'low'|'medium'|'high'} Priority
 * @typedef {'todo'|'in-progress'|'done'} Status
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {Status} status
 * @property {Priority} priority
 * @property {string[]} tags
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string|null} dueDate
 */

/**
 * @param {{ title: string, description?: string, priority?: Priority, tags?: string[], dueDate?: string|null }} data
 * @returns {Task}
 */
export function createTask(data) {
  throw new Error('TODO 3.1.1: not implemented');
}

/**
 * @param {Task} task
 * @param {Partial<Omit<Task, 'id'|'createdAt'>>} patch
 * @returns {Task}
 */
export function updateTask(task, patch) {
  throw new Error('TODO 3.1.2: not implemented');
}

/**
 * @param {Task} task
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isOverdue(task, now = new Date()) {
  throw new Error('TODO 3.1.3: not implemented');
}
