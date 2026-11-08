/**
 * Эталон модуля 11.1 — исправленная мутация.
 */

/**
 * @typedef {import('../../domain/task.js').Task} Task
 */

/**
 * @param {Task} task
 * @param {string} tag
 * @returns {Task}
 */
export function addTagToTask(task, tag) {
  const normalized = tag.trim().toLowerCase();
  const tags = Array.isArray(task.tags) ? task.tags : [];
  if (!normalized || tags.includes(normalized)) return task;
  return { ...task, tags: [...tags, normalized] };
}
