/**
 * Эталон модуля 4.4 — итерируемая коллекция задач.
 */

/**
 * @typedef {import('./task.js').Task} Task
 */

export class TaskList {
  /** @type {Task[]} */
  #tasks;

  /** @param {Task[]} [tasks] */
  constructor(tasks = []) {
    if (!Array.isArray(tasks)) throw new TypeError('TaskList expects an array');
    this.#tasks = [...tasks];
  }

  /** @param {Task} task @returns {this} */
  add(task) {
    this.#tasks.push(task);
    return this;
  }

  /** @param {string} id @returns {boolean} */
  remove(id) {
    const index = this.#tasks.findIndex((task) => task.id === id);
    if (index === -1) return false;
    this.#tasks.splice(index, 1);
    return true;
  }

  /** @returns {number} */
  get length() {
    return this.#tasks.length;
  }

  /** @returns {Iterator<Task>} */
  *[Symbol.iterator]() {
    yield* this.#tasks;
  }

  /** @param {string|Task[]} json @returns {TaskList} */
  static fromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    if (Array.isArray(data)) return new TaskList(data);
    if (data && Array.isArray(data.tasks)) return new TaskList(data.tasks);
    throw new TypeError('TaskList.fromJSON expects an array or { tasks: [] }');
  }

  /** @returns {Task[]} */
  toJSON() {
    return [...this.#tasks];
  }
}
