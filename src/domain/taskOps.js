/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 3 · УПРАЖНЕНИЕ 3.2 — Чистые операции над задачами
 * ═══════════════════════════════════════════════════════════
 *  Тема:           spread, деструктуризация, иммутабельность
 *  Java-аналогия:  List.copyOf() + record with-ers, но руками
 *  Тесты:          npx vitest run tests/m03/taskOps.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  Реализуйте функции CRUD. Ни одна не должна мутировать входные данные.
 *  1. addTask(tasks, task) — новый массив с задачей в конце.
 *  2. removeTask(tasks, id) — новый массив без задачи.
 *  3. replaceTask(tasks, id, patch) — новый массив; у изменённой задачи
 *     обновляется updatedAt, остальные элементы сохраняют ссылки.
 *  4. moveTask(tasks, id, status) — replaceTask с новым статусом.
 *  5. toggleTag(task, tag) — новый объект задачи: тег добавляется или
 *     удаляется (без учёта регистра), исходный task не меняется.
 *
 *  ТРЕБОВАНИЯ
 *  - Возвращайте новые массивы/объекты, не меняйте аргументы.
 *  - Не тронутые задачи должны остаться теми же ссылками.
 *
 *  ЛОВУШКА
 *  Что произойдёт, если сделать tasks.push(task) и вернуть tasks?
 *  Массив изменится у всех, кто на него ссылается, а React не увидит
 *  изменения, потому что ссылка осталась прежней.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {import('./task.js').Task} Task
 */

/**
 * @param {Task[]} tasks
 * @param {Task} task
 * @returns {Task[]}
 */
export function addTask(tasks, task) {
  throw new Error('TODO 3.2.1: not implemented');
}

/**
 * @param {Task[]} tasks
 * @param {string} id
 * @returns {Task[]}
 */
export function removeTask(tasks, id) {
  throw new Error('TODO 3.2.2: not implemented');
}

/**
 * @param {Task[]} tasks
 * @param {string} id
 * @param {Partial<Task>} patch
 * @returns {Task[]}
 */
export function replaceTask(tasks, id, patch) {
  throw new Error('TODO 3.2.3: not implemented');
}

/**
 * @param {Task[]} tasks
 * @param {string} id
 * @param {import('./task.js').Status} status
 * @returns {Task[]}
 */
export function moveTask(tasks, id, status) {
  throw new Error('TODO 3.2.4: not implemented');
}

/**
 * @param {Task} task
 * @param {string} tag
 * @returns {Task}
 */
export function toggleTag(task, tag) {
  throw new Error('TODO 3.2.5: not implemented');
}

/**
 * @typedef {{ status?: string, priority?: string, tag?: string|null, text?: string }} TaskFilter
 */

/**
 * @param {Task[]} tasks
 * @param {TaskFilter} [filter]
 * @returns {Task[]}
 */
export function filterTasks(tasks, filter = {}) {
  throw new Error('TODO 3.3.1: not implemented');
}

/**
 * @param {Task[]} tasks
 * @param {'priority'|'dueDate'|'createdAt'|'title'} by
 * @param {'asc'|'desc'} [direction]
 * @returns {Task[]}
 */
export function sortTasks(tasks, by, direction = 'asc') {
  throw new Error('TODO 3.3.2: not implemented');
}

/**
 * @param {Task[]} tasks
 * @returns {{ todo: Task[], 'in-progress': Task[], done: Task[] }}
 */
export function groupByStatus(tasks) {
  throw new Error('TODO 3.3.3: not implemented');
}
