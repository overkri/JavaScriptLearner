/**
 * Эталон модуля 9.1 — reducer TaskFlow.
 */

import { addTask, moveTask, removeTask, replaceTask } from '../domain/taskOps.js';

/**
 * @typedef {import('../domain/task.js').Task} Task
 * @typedef {{ status: string, priority: string, tag: string|null, text: string }} TaskFilter
 * @typedef {{ tasks: Task[], filter: TaskFilter }} State
 */

/** @returns {State} */
export function createInitialState() {
  return {
    tasks: [],
    filter: { status: 'all', priority: 'all', tag: null, text: '' },
  };
}

/**
 * @param {State} state
 * @param {{ type?: string, [key: string]: any }} action
 * @returns {State}
 */
export function reducer(state, action) {
  if (!action || typeof action.type !== 'string') return state;

  switch (action.type) {
    case 'TASKS_LOADED': {
      const tasks = Array.isArray(action.tasks) ? action.tasks : [];
      return { ...state, tasks };
    }

    case 'TASK_ADDED': {
      if (!action.task) return state;
      return { ...state, tasks: addTask(state.tasks, action.task) };
    }

    case 'TASK_UPDATED': {
      const tasks = replaceTask(state.tasks, action.id, action.patch ?? {});
      return tasks === state.tasks ? state : { ...state, tasks };
    }

    case 'TASK_REMOVED': {
      const tasks = removeTask(state.tasks, action.id);
      return tasks === state.tasks ? state : { ...state, tasks };
    }

    case 'TASK_MOVED': {
      const tasks = moveTask(state.tasks, action.id, action.status);
      return tasks === state.tasks ? state : { ...state, tasks };
    }

    case 'FILTER_CHANGED': {
      return {
        ...state,
        filter: { ...state.filter, ...(action.filter ?? {}) },
      };
    }

    default:
      return state;
  }
}
