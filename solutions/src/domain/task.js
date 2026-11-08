/**
 * Эталон модуля 3.1 — фабрика задач.
 */

import { uid } from '../utils/id.js';
import { validateDueDate, validateTitle } from '../utils/validators.js';
import { isPriority } from './priority.js';

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

const STATUSES = /** @type {const} */ (['todo', 'in-progress', 'done']);

/**
 * @param {unknown} tags
 * @returns {string[]}
 */
function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [
    ...new Set(
      tags
        .filter((tag) => typeof tag === 'string')
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

/**
 * @param {string} title
 * @returns {string}
 */
function normalizeTitle(title) {
  return title.trim().replace(/\s+/g, ' ');
}

/**
 * @param {string} dueDate
 * @returns {boolean}
 */
function isRealDate(dueDate) {
  return validateDueDate(dueDate).ok;
}

/**
 * @param {{ title: string, description?: string, priority?: Priority, tags?: string[], dueDate?: string|null }} data
 * @returns {Task}
 */
export function createTask(data) {
  const {
    title,
    description = '',
    priority = 'medium',
    tags = [],
    dueDate = null,
  } = data ?? {};

  const titleResult = validateTitle(title);
  if (!titleResult.ok) {
    throw new Error(`Invalid title: ${titleResult.error}`);
  }
  if (!isPriority(priority)) {
    throw new Error(`Invalid priority: ${priority}`);
  }
  if (dueDate !== null && !isRealDate(dueDate)) {
    throw new Error('Invalid dueDate: expected YYYY-MM-DD or null');
  }

  const now = new Date().toISOString();
  return {
    id: uid(),
    title: normalizeTitle(title),
    description: typeof description === 'string' ? description : '',
    status: 'todo',
    priority,
    tags: normalizeTags(tags),
    createdAt: now,
    updatedAt: now,
    dueDate,
  };
}

/**
 * @param {Task} task
 * @param {Partial<Omit<Task, 'id'|'createdAt'>>} patch
 * @returns {Task}
 */
export function updateTask(task, patch = {}) {
  /** @type {Partial<Task>} */
  const normalized = {};

  if (patch.title !== undefined) {
    const titleResult = validateTitle(patch.title);
    if (!titleResult.ok) throw new Error(`Invalid title: ${titleResult.error}`);
    normalized.title = normalizeTitle(/** @type {string} */ (patch.title));
  }
  if (patch.description !== undefined) {
    normalized.description = typeof patch.description === 'string' ? patch.description : '';
  }
  if (patch.status !== undefined) {
    if (!STATUSES.includes(/** @type {Status} */ (patch.status))) {
      throw new Error(`Invalid status: ${patch.status}`);
    }
    normalized.status = patch.status;
  }
  if (patch.priority !== undefined) {
    if (!isPriority(patch.priority)) throw new Error(`Invalid priority: ${patch.priority}`);
    normalized.priority = patch.priority;
  }
  if (patch.tags !== undefined) {
    normalized.tags = normalizeTags(patch.tags);
  }
  if (patch.dueDate !== undefined) {
    if (patch.dueDate !== null && !isRealDate(patch.dueDate)) {
      throw new Error('Invalid dueDate: expected YYYY-MM-DD or null');
    }
    normalized.dueDate = patch.dueDate;
  }

  return {
    ...task,
    ...normalized,
    id: task.id,
    createdAt: task.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * @param {Task} task
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isOverdue(task, now = new Date()) {
  if (!task?.dueDate || task.status === 'done') return false;
  const endOfDay = new Date(`${task.dueDate}T23:59:59.999`);
  if (Number.isNaN(endOfDay.getTime())) return false;
  return now.getTime() > endOfDay.getTime();
}
