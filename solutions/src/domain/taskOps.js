/**
 * Эталон модуля 3.2–3.3 — иммутабельные операции и фильтры.
 */

import { priorityWeight } from './priority.js';

/**
 * @typedef {import('./task.js').Task} Task
 * @typedef {import('./task.js').Status} Status
 */

/** @returns {string} */
function nowIso() {
  return new Date().toISOString();
}

/**
 * @param {Task[]} tasks
 * @param {Task} task
 * @returns {Task[]}
 */
export function addTask(tasks, task) {
  return [...tasks, task];
}

/**
 * @param {Task[]} tasks
 * @param {string} id
 * @returns {Task[]}
 */
export function removeTask(tasks, id) {
  const next = tasks.filter((task) => task.id !== id);
  return next.length === tasks.length ? tasks : next;
}

/**
 * @param {Task[]} tasks
 * @param {string} id
 * @param {Partial<Task>} patch
 * @returns {Task[]}
 */
export function replaceTask(tasks, id, patch) {
  let found = false;
  const next = tasks.map((task) => {
    if (task.id !== id) return task;
    found = true;
    return { ...task, ...patch, updatedAt: nowIso() };
  });
  return found ? next : tasks;
}

/**
 * @param {Task[]} tasks
 * @param {string} id
 * @param {Status} status
 * @returns {Task[]}
 */
export function moveTask(tasks, id, status) {
  return replaceTask(tasks, id, { status });
}

/**
 * @param {Task} task
 * @param {string} tag
 * @returns {Task}
 */
export function toggleTag(task, tag) {
  const normalized = typeof tag === 'string' ? tag.trim().toLowerCase() : '';
  if (!normalized) return task;

  const tags = Array.isArray(task.tags) ? task.tags : [];
  const exists = tags.some((item) => item.toLowerCase() === normalized);
  const nextTags = exists
    ? tags.filter((item) => item.toLowerCase() !== normalized)
    : [...tags, normalized];

  return { ...task, tags: nextTags };
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
  const { status, priority, tag, text } = filter;
  const needle = typeof text === 'string' ? text.trim().toLowerCase() : '';
  const wantedTag = typeof tag === 'string' ? tag.trim().toLowerCase() : '';

  return tasks.filter((task) => {
    if (status && status !== 'all' && task.status !== status) return false;
    if (priority && priority !== 'all' && task.priority !== priority) return false;
    if (wantedTag) {
      const tags = Array.isArray(task.tags) ? task.tags : [];
      if (!tags.some((item) => item.toLowerCase() === wantedTag)) return false;
    }
    if (needle) {
      const haystack = `${task.title ?? ''} ${task.description ?? ''}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

/**
 * @param {Task[]} tasks
 * @param {'priority'|'dueDate'|'createdAt'|'title'} by
 * @param {'asc'|'desc'} [direction]
 * @returns {Task[]}
 */
export function sortTasks(tasks, by, direction = 'asc') {
  const sign = direction === 'desc' ? -1 : 1;

  const compare = (a, b) => {
    if (by === 'priority') {
      return (priorityWeight(a.priority) - priorityWeight(b.priority)) * sign;
    }

    if (by === 'dueDate') {
      const aDate = a.dueDate ?? null;
      const bDate = b.dueDate ?? null;
      if (aDate === null && bDate === null) return 0;
      if (aDate === null) return 1;
      if (bDate === null) return -1;
      return aDate.localeCompare(bDate) * sign;
    }

    if (by === 'title') {
      return String(a.title ?? '').localeCompare(String(b.title ?? ''), 'ru') * sign;
    }

    return String(a.createdAt ?? '').localeCompare(String(b.createdAt ?? '')) * sign;
  };

  return [...tasks].sort(compare);
}

/**
 * @param {Task[]} tasks
 * @returns {{ todo: Task[], 'in-progress': Task[], done: Task[] }}
 */
export function groupByStatus(tasks) {
  /** @type {{ todo: Task[], 'in-progress': Task[], done: Task[] }} */
  const groups = { todo: [], 'in-progress': [], done: [] };
  for (const task of tasks) {
    if (task.status in groups) {
      groups[task.status].push(task);
    }
  }
  return groups;
}
