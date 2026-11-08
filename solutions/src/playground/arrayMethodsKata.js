/**
 * Эталон модуля 3.6 — kata на методы массивов (без циклов).
 */

import { isOverdue } from '../domain/task.js';

/**
 * @typedef {import('../domain/task.js').Task} Task
 */

/** @param {number[]} numbers @returns {number[]} */
export function doubleAll(numbers) {
  return numbers.map((value) => value * 2);
}

/** @param {number[]} numbers @returns {number[]} */
export function onlyEven(numbers) {
  return numbers.filter((value) => value % 2 === 0);
}

/** @param {number[]} numbers @returns {number} */
export function sum(numbers) {
  return numbers.reduce((total, value) => total + value, 0);
}

/** @param {Task[]} tasks @param {string} query @returns {Task|undefined} */
export function findTaskByTitle(tasks, query) {
  const needle = query.trim().toLowerCase();
  return tasks.find((task) => task.title.toLowerCase().includes(needle));
}

/** @param {Task[]} tasks @param {string} priority @returns {number} */
export function indexOfPriority(tasks, priority) {
  return tasks.findIndex((task) => task.priority === priority);
}

/** @param {Task[]} tasks @returns {boolean} */
export function hasOverdue(tasks) {
  return tasks.some((task) => isOverdue(task));
}

/** @param {Task[]} tasks @returns {boolean} */
export function allDone(tasks) {
  return tasks.every((task) => task.status === 'done');
}

/** @param {Task[]} tasks @returns {string[]} */
export function flattenTags(tasks) {
  return tasks.flatMap((task) => task.tags ?? []);
}

/** @param {Task[]} tasks @returns {string|undefined} */
export function lastTag(tasks) {
  return flattenTags(tasks).at(-1);
}

/** @param {number[]} numbers @returns {number[]} */
export function sortedNumbers(numbers) {
  return numbers.toSorted((a, b) => a - b);
}

/** @param {number[]} numbers @param {number} index @param {number} value @returns {number[]} */
export function insertAt(numbers, index, value) {
  return numbers.toSpliced(index, 0, value);
}
