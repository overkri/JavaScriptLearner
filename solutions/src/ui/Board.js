/**
 * Эталон модуля 6.3 — доска с делегированием.
 */

import { renderTaskCard } from './TaskCard.js';
import { clear, h } from './dom.js';

/**
 * @typedef {import('../domain/task.js').Task} Task
 * @typedef {{ todo: Task[], 'in-progress': Task[], done: Task[] }} TasksByStatus
 * @typedef {(action: { type: string, id: string }) => void} BoardActionHandler
 */

/** @type {WeakMap<HTMLElement, { onAction: BoardActionHandler }>} */
const boardStates = new WeakMap();

const COLUMNS = [
  { status: 'todo', title: 'К выполнению' },
  { status: 'in-progress', title: 'В работе' },
  { status: 'done', title: 'Готово' },
];

/**
 * @param {HTMLElement} root
 * @param {TasksByStatus} tasksByStatus
 * @param {BoardActionHandler} [onAction]
 * @returns {HTMLElement}
 */
export function renderBoard(root, tasksByStatus, onAction = () => {}) {
  clear(root);

  for (const column of COLUMNS) {
    const tasks = tasksByStatus[column.status] ?? [];
    const cards = tasks.map((task) => renderTaskCard(task));

    root.append(
      h(
        'section',
        { className: 'board-column', dataset: { status: column.status } },
        h(
          'header',
          { className: 'column-header' },
          h('h2', {}, column.title),
          h('span', { className: 'column-count' }, String(tasks.length)),
        ),
        h(
          'div',
          { className: 'column-cards' },
          cards.length > 0
            ? cards
            : h('p', { className: 'column-empty' }, 'Нет задач'),
        ),
      ),
    );
  }

  const existing = boardStates.get(root);
  if (existing) {
    existing.onAction = onAction;
  } else {
    const state = { onAction };
    boardStates.set(root, state);
    root.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target.closest('[data-action]') : null;
      if (!target || !root.contains(target)) return;
      const current = boardStates.get(root);
      current?.onAction({
        type: target.getAttribute('data-action') ?? '',
        id: target.getAttribute('data-id') ?? '',
      });
    });
  }

  return root;
}
