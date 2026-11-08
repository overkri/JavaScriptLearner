/**
 * Эталон модуля 12.5 — компоненты мини-React.
 */

import { h } from '../createElement.js';

/**
 * @typedef {import('../../domain/task.js').Task} Task
 */

/**
 * @param {{ task: Task }} props
 */
export function TaskCard({ task }) {
  const tags = Array.isArray(task.tags) ? task.tags : [];
  return h(
    'article',
    {
      className: `task-card priority-${task.priority}`,
      dataset: { id: task.id },
      draggable: 'true',
    },
    h('h3', { className: 'task-card__title' }, task.title),
    task.description ? h('p', { className: 'task-card__description' }, task.description) : null,
    h(
      'div',
      { className: 'task-card__tags' },
      tags.map((tag) => h('span', { className: 'tag' }, `#${tag}`)),
    ),
    h(
      'footer',
      { className: 'task-card__footer' },
      h('span', { className: 'task-card__due' }, task.dueDate ? `📅 ${task.dueDate}` : 'без срока'),
      h('span', { className: 'task-card__priority' }, task.priority),
    ),
  );
}
