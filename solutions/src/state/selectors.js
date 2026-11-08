/**
 * Эталон модуля 9.5 — мемоизированные селекторы.
 */

import { computeStats } from '../domain/stats.js';
import { collectTags } from '../domain/tags.js';
import { filterTasks } from '../domain/taskOps.js';

/**
 * @typedef {import('../domain/task.js').Task} Task
 * @typedef {{ tasks: Task[], filter: { status?: string, priority?: string, tag?: string|null, text?: string } }} State
 */

/**
 * @param {...((state: any) => any) | ((...args: any[]) => any)} inputSelectors
 * @returns {(state: any) => any}
 */
export function createSelector(...inputSelectors) {
  const resultFn = /** @type {(...args: any[]) => any} */ (inputSelectors.pop());
  const selectors = /** @type {Array<(state: any) => any>} */ (inputSelectors);

  /** @type {any[]|null} */
  let lastInputs = null;
  /** @type {any} */
  let lastResult;

  return (state) => {
    const inputs = selectors.map((selector) => selector(state));
    if (
      lastInputs !== null &&
      inputs.length === lastInputs.length &&
      inputs.every((input, index) => Object.is(input, lastInputs[index]))
    ) {
      return lastResult;
    }

    lastInputs = inputs;
    lastResult = resultFn(...inputs);
    return lastResult;
  };
}

export const selectVisibleTasks = createSelector(
  (state) => state.tasks,
  (state) => state.filter,
  (tasks, filter) => filterTasks(tasks, filter),
);

export const selectStats = createSelector(
  (state) => state.tasks,
  (tasks) => computeStats(tasks),
);

export const selectTags = createSelector(
  (state) => state.tasks,
  (tasks) => collectTags(tasks),
);
