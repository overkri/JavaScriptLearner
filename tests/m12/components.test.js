// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { h } from '../../src/mini-react/createElement.js';
import { App } from '../../src/mini-react/components/App.js';
import { Board } from '../../src/mini-react/components/Board.js';
import { resetHooks } from '../../src/mini-react/hooks.js';
import { render, resetRenderState } from '../../src/mini-react/render.js';
import { createInitialState, reducer } from '../../src/state/reducer.js';
import { createStore } from '../../src/state/store.js';

/** @param {Record<string, any>} overrides */
function makeTask(overrides = {}) {
  return {
    id: 't1',
    title: 'First task',
    description: '',
    status: 'todo',
    priority: 'high',
    tags: ['work'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    dueDate: null,
    ...overrides,
  };
}

/** @type {HTMLElement} */
let container;

beforeEach(() => {
  document.body.replaceChildren();
  resetRenderState();
  resetHooks();
  container = document.createElement('div');
  document.body.append(container);
});

afterEach(() => {
  resetRenderState();
  resetHooks();
});

describe('Board components', () => {
  it('renders columns and task cards', () => {
    render(
      h(Board, {
        tasksByStatus: {
          todo: [makeTask()],
          'in-progress': [],
          done: [makeTask({ id: 't2', title: 'Done task', status: 'done' })],
        },
      }),
      container,
    );

    expect(container.querySelectorAll('.board-column')).toHaveLength(3);
    expect(container.querySelectorAll('.task-card')).toHaveLength(2);
    expect(container.querySelector('[data-status="todo"] .task-card__title').textContent).toBe(
      'First task',
    );
    expect(container.querySelector('[data-status="in-progress"] .column-empty')).not.toBeNull();
    expect(container.querySelectorAll('.tag')).toHaveLength(2);
  });
});

describe('App', () => {
  it('renders tasks from the store and filters by search text', () => {
    const store = createStore(reducer, createInitialState());
    store.dispatch({
      type: 'TASKS_LOADED',
      tasks: [
        makeTask({ id: 't1', title: 'Buy milk' }),
        makeTask({ id: 't2', title: 'Write code', priority: 'low' }),
      ],
    });

    render(h(App, { store }), container);
    expect(container.querySelectorAll('.task-card')).toHaveLength(2);
    expect(container.textContent).toContain('Показано: 2 из 2');

    const input = container.querySelector('input[type="search"]');
    input.value = 'milk';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(container.querySelectorAll('.task-card')).toHaveLength(1);
    expect(container.querySelector('.task-card__title').textContent).toBe('Buy milk');
    expect(container.textContent).toContain('Показано: 1 из 2');
  });
});
