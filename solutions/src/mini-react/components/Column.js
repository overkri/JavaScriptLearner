/**
 * Модуль 12.5 — колонка канбана как функция props → vnode.
 */

import { h } from '../createElement.js';
import { TaskCard } from './TaskCard.js';

/**
 * @typedef {import('../../domain/task.js').Task} Task
 */

/**
 * @param {{ status: string, title: string, tasks: Task[] }} props
 */
export function Column({ status, title, tasks }) {
  return h(
    'section',
    { className: 'board-column', dataset: { status } },
    h(
      'header',
      { className: 'column-header' },
      h('h2', {}, title),
      h('span', { className: 'column-count' }, String(tasks.length)),
    ),
    h(
      'div',
      { className: 'column-cards' },
      tasks.length > 0
        ? tasks.map((task) => h(TaskCard, { key: task.id, task }))
        : h('p', { className: 'column-empty' }, 'Нет задач'),
    ),
  );
}
