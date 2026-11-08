// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { h } from '../../src/mini-react/createElement.js';
import { resetHooks } from '../../src/mini-react/hooks.js';
import { render, resetRenderState } from '../../src/mini-react/render.js';
import { useStore } from '../../src/mini-react/useStore.js';
import { createInitialState, reducer } from '../../src/state/reducer.js';
import { createStore } from '../../src/state/store.js';

/** @param {Record<string, any>} overrides */
function makeTask(overrides = {}) {
  return {
    id: 't1',
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

describe('useStore', () => {
  it('returns the state and re-renders on dispatch', () => {
    const store = createStore(reducer, createInitialState());

    function Display() {
      const state = useStore(store);
      return h('span', { id: 'count' }, String(state.tasks.length));
    }

    render(h(Display), container);
    expect(container.querySelector('#count').textContent).toBe('0');

    store.dispatch({ type: 'TASKS_LOADED', tasks: [makeTask()] });
    expect(container.querySelector('#count').textContent).toBe('1');

    store.dispatch({ type: 'TASK_ADDED', task: makeTask({ id: 't2' }) });
    expect(container.querySelector('#count').textContent).toBe('2');
  });

  it('reads the latest state after nested updates', () => {
    const store = createStore(reducer, createInitialState());

    function Display() {
      const state = useStore(store);
      return h('span', {}, state.filter.text || 'empty');
    }

    render(h(Display), container);
    store.dispatch({ type: 'FILTER_CHANGED', filter: { text: 'milk' } });
    expect(container.textContent).toBe('milk');
  });
});
