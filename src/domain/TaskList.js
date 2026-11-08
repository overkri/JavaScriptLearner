/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 4 · УПРАЖНЕНИЕ 4.4 — TaskList и Symbol.iterator
 * ═══════════════════════════════════════════════════════════
 *  Тема:           iterable protocol, generators, toJSON, static
 *  Java-аналогия:  Iterable<Task> + List<Task>, но JSON.stringify
 *                  умеет вызывать toJSON()
 *  Тесты:          npx vitest run tests/m04/TaskList.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  Реализуйте class TaskList — обёртку над массивом задач:
 *  - конструктор принимает массив (по умолчанию []), сохраняет КОПИЮ;
 *  - add(task) добавляет задачу и возвращает this;
 *  - remove(id) удаляет задачу, возвращает boolean;
 *  - геттер length;
 *  - [Symbol.iterator]() — чтобы работали for...of и spread;
 *  - static fromJSON(json) — принимает JSON-строку или массив;
 *  - toJSON() — возвращает массив для JSON.stringify.
 *
 *  ПОДСКАЗКА
 *  Генераторный метод: *[Symbol.iterator]() { yield* this.#tasks; }
 *  JSON.stringify вызывает toJSON() автоматически.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {import('../domain/task.js').Task} Task
 */

export class TaskList {
  /** @param {Task[]} [tasks] */
  constructor(tasks = []) {
    this.tasks = tasks;
    throw new Error('TODO 4.4.1: not implemented');
  }

  /** @param {Task} task @returns {this} */
  add(task) {
    throw new Error('TODO 4.4.2: not implemented');
  }

  /** @param {string} id @returns {boolean} */
  remove(id) {
    throw new Error('TODO 4.4.3: not implemented');
  }

  /** @returns {number} */
  get length() {
    throw new Error('TODO 4.4.4: not implemented');
  }

  /** @returns {Iterator<Task>} */
  [Symbol.iterator]() {
    throw new Error('TODO 4.4.5: not implemented');
  }

  /** @param {string|Task[]} json @returns {TaskList} */
  static fromJSON(json) {
    throw new Error('TODO 4.4.6: not implemented');
  }

  /** @returns {Task[]} */
  toJSON() {
    throw new Error('TODO 4.4.7: not implemented');
  }
}
