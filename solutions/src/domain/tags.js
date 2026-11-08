/**
 * Эталон модуля 3.5 — Set/Map и переименование тегов.
 */

/**
 * @typedef {import('./task.js').Task} Task
 */

/**
 * @param {Task[]} tasks
 * @returns {Set<string>}
 */
export function collectTags(tasks) {
  return new Set(
    tasks.flatMap((task) => (task.tags ?? []).map((tag) => tag.trim().toLowerCase())).filter(Boolean),
  );
}

/**
 * @param {Task[]} tasks
 * @returns {Map<string, number>}
 */
export function tagFrequency(tasks) {
  /** @type {Map<string, number>} */
  const frequency = new Map();
  for (const task of tasks) {
    for (const tag of task.tags ?? []) {
      const normalized = tag.trim().toLowerCase();
      if (!normalized) continue;
      frequency.set(normalized, (frequency.get(normalized) ?? 0) + 1);
    }
  }
  return frequency;
}

/**
 * @param {Task[]} tasks
 * @param {string} from
 * @param {string} to
 * @returns {Task[]}
 */
export function renameTag(tasks, from, to) {
  const source = typeof from === 'string' ? from.trim().toLowerCase() : '';
  const target = typeof to === 'string' ? to.trim().toLowerCase() : '';
  if (!source) return tasks;

  let changed = false;
  const next = tasks.map((task) => {
    const tags = Array.isArray(task.tags) ? task.tags : [];
    if (!tags.some((tag) => tag.toLowerCase() === source)) return task;

    changed = true;
    const renamed = tags.map((tag) => (tag.toLowerCase() === source ? target : tag));
    return {
      ...task,
      tags: [...new Set(renamed.filter(Boolean).map((tag) => tag.toLowerCase()))],
    };
  });

  return changed ? next : tasks;
}
