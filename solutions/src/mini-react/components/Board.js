/**
 * Модуль 12.5 — доска из трёх колонок.
 */

import { h } from '../createElement.js';
import { Column } from './Column.js';

/**
 * @typedef {import('../../domain/task.js').Task} Task
 */

const COLUMNS = [
  { status: 'todo', title: 'К выполнению' },
  { status: 'in-progress', title: 'В работе' },
  { status: 'done', title: 'Готово' },
];

/**
 * @param {{ tasksByStatus: { todo: Task[], 'in-progress': Task[], done: Task[] } }} props
 */
export function Board({ tasksByStatus }) {
  return h(
    'section',
    { className: 'board' },
    COLUMNS.map((column) =>
      h(Column, {
        key: column.status,
        status: column.status,
        title: column.title,
        tasks: tasksByStatus[column.status] ?? [],
      }),
    ),
  );
}
