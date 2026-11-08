/**
 * Эталон модуля 1.2 — форматирование.
 */

/**
 * @param {unknown} value
 * @returns {string}
 */
export function formatTitle(value) {
  if (typeof value !== 'string') return '';
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (normalized.length <= 80) return normalized;
  return `${normalized.slice(0, 79).trimEnd()}…`;
}

/**
 * @param {unknown} tags
 * @returns {string}
 */
export function formatTags(tags) {
  if (!Array.isArray(tags)) return '';
  return tags
    .filter((tag) => typeof tag === 'string' && tag.trim().length > 0)
    .map((tag) => `#${tag.trim()}`)
    .join(' ');
}

/**
 * @param {import('../domain/task.js').Task|null|undefined} task
 * @returns {string}
 */
export function describeTask(task) {
  const title = formatTitle(task?.title) || 'Без названия';
  const priority = task?.priority ?? 'medium';
  const tags = formatTags(task?.tags);
  const due = task?.dueDate ? ` · до ${task.dueDate}` : '';
  const tagsPart = tags ? ` (${tags})` : '';
  return `${title} [${priority}]${tagsPart}${due}`;
}
