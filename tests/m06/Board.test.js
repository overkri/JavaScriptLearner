// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderBoard } from '../../src/ui/Board.js';
import { h } from '../../src/ui/dom.js';

/** @param {Record<string, any>} overrides */
function makeTask(overrides = {}) {
  return {
    id: 'task-1',
    title: 'Task',
    description: '',
    status: 'todo',
    priority: 'medium',
    tags: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    dueDate: null,
    ...overrides,
  };
}

const tasksByStatus = {
  todo: [makeTask({ id: 't1', title: 'First' })],
  'in-progress': [makeTask({ id: 't2', title: 'Second', status: 'in-progress' })],
  done: [],
};

let root;

beforeEach(() => {
  document.body.replaceChildren();
  root = h('section', { id: 'board' });
  document.body.append(root);
});

describe('renderBoard', () => {
  it('renders three columns with cards and counts', () => {
    renderBoard(root, tasksByStatus);
    const columns = root.querySelectorAll('.board-column');
    expect(columns).toHaveLength(3);
    expect([...columns].map((column) => column.dataset.status)).toEqual([
      'todo',
      'in-progress',
      'done',
    ]);
    expect(root.querySelectorAll('.task-card')).toHaveLength(2);
    expect(columns[0].querySelector('.column-count').textContent).toBe('1');
    expect(columns[2].querySelector('.column-count').textContent).toBe('0');
    expect(columns[2].querySelector('.column-empty')).not.toBeNull();
  });

  it('delegates clicks on nested elements', () => {
    const onAction = vi.fn();
    renderBoard(root, tasksByStatus, onAction);
    const button = root.querySelector('[data-action="edit"]');
    const nested = h('span', {}, 'icon');
    button.append(nested);
    nested.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onAction).toHaveBeenCalledWith({ type: 'edit', id: 't1' });
  });

  it('does not call the handler for clicks outside actions', () => {
    const onAction = vi.fn();
    renderBoard(root, tasksByStatus, onAction);
    root.querySelector('.task-card__title').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onAction).not.toHaveBeenCalled();
  });

  it('adds only one click listener across re-renders', () => {
    const spy = vi.spyOn(root, 'addEventListener');
    renderBoard(root, tasksByStatus);
    renderBoard(root, tasksByStatus);
    const clickCalls = spy.mock.calls.filter(([type]) => type === 'click');
    expect(clickCalls).toHaveLength(1);
  });

  it('uses the latest onAction after a re-render', () => {
    const first = vi.fn();
    const second = vi.fn();
    renderBoard(root, tasksByStatus, first);
    renderBoard(root, tasksByStatus, second);
    root.querySelector('[data-action="delete"]').click();
    expect(second).toHaveBeenCalledWith({ type: 'delete', id: 't1' });
    expect(first).not.toHaveBeenCalled();
  });

  it('clears previous content on re-render', () => {
    renderBoard(root, tasksByStatus);
    renderBoard(root, { todo: [], 'in-progress': [], done: [] });
    expect(root.querySelectorAll('.board-column')).toHaveLength(3);
    expect(root.querySelectorAll('.task-card')).toHaveLength(0);
  });
});
