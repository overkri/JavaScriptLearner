/**
 * Эталон модуля 6.2 — карточка задачи.
 */

import { isOverdue } from '../domain/task.js';
import { h } from './dom.js';

/**
 * @typedef {import('../domain/task.js').Task} Task
 */

/**
 * @param {Task} task
 * @returns {HTMLElement}
 */
export function renderTaskCard(task) {
  const overdue = isOverdue(task);
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
      h(
        'span',
        { className: `task-card__due${overdue ? ' is-overdue' : ''}` },
        task.dueDate ? `📅 ${task.dueDate}` : 'без срока',
      ),
      h('span', { className: 'task-card__priority' }, task.priority),
      h(
        'div',
        { className: 'task-card__actions' },
        h(
          'button',
          {
            type: 'button',
            className: 'icon-button',
            dataset: { action: 'edit', id: task.id },
            'aria-label': 'Редактировать',
            title: 'Редактировать',
          },
          '✎',
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'icon-button',
            dataset: { action: 'delete', id: task.id },
            'aria-label': 'Удалить',
            title: 'Удалить',
          },
          '✕',
        ),
      ),
    ),
  );
}
