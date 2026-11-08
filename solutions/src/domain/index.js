/**
 * Эталон модуля 5.2 — barrel домена.
 */

export { createTask as default, createTask, updateTask, isOverdue } from './task.js';
export {
  addTask,
  removeTask,
  replaceTask,
  moveTask,
  toggleTag,
  filterTasks,
  sortTasks,
  groupByStatus,
} from './taskOps.js';
export { computeStats } from './stats.js';
export { collectTags, tagFrequency, renameTag } from './tags.js';
export { TaskList } from './TaskList.js';
export { PRIORITY, priorityWeight, isPriority } from './priority.js';
