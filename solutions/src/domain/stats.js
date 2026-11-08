/**
 * Эталон модуля 3.4 — статистика одним проходом reduce.
 */

import { isOverdue } from './task.js';

/**
 * @typedef {import('./task.js').Task} Task
 * @typedef {Object} TaskStats
 * @property {number} total
 * @property {{ todo: number, 'in-progress': number, done: number }} byStatus
 * @property {{ low: number, medium: number, high: number }} byPriority
 * @property {number} overdue
 * @property {number} completionRate
 * @property {Array<{ tag: string, count: number }>} topTags
 */

/**
 * @param {Task[]} tasks
 * @returns {TaskStats}
 */
export function computeStats(tasks) {
  const initial = {
    total: 0,
    byStatus: { todo: 0, 'in-progress': 0, done: 0 },
    byPriority: { low: 0, medium: 0, high: 0 },
    overdue: 0,
    /** @type {Map<string, number>} */
    tagCounts: new Map(),
  };

  const accumulated = tasks.reduce((stats, task) => {
    stats.total += 1;

    if (task.status in stats.byStatus) {
      stats.byStatus[task.status] += 1;
    }
    if (task.priority in stats.byPriority) {
      stats.byPriority[task.priority] += 1;
    }
    if (isOverdue(task)) {
      stats.overdue += 1;
    }
    for (const tag of task.tags ?? []) {
      const normalized = tag.toLowerCase();
      stats.tagCounts.set(normalized, (stats.tagCounts.get(normalized) ?? 0) + 1);
    }

    return stats;
  }, initial);

  const topTags = [...accumulated.tagCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru'))
    .slice(0, 3)
    .map(([tag, count]) => ({ tag, count }));

  return {
    total: accumulated.total,
    byStatus: accumulated.byStatus,
    byPriority: accumulated.byPriority,
    overdue: accumulated.overdue,
    completionRate: accumulated.total === 0 ? 0 : accumulated.byStatus.done / accumulated.total,
    topTags,
  };
}
