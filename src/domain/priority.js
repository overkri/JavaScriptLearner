/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 1 · УПРАЖНЕНИЕ 1.1 — Приоритеты как «enum»
 * ═══════════════════════════════════════════════════════════
 *  Тема:           Object.freeze, литералы, сравнение значений
 *  Java-аналогия:  enum Priority { LOW, MEDIUM, HIGH }
 *  Тесты:          npx vitest run tests/m01/priority.test.js
 *  Уровень:        ★☆☆
 *
 *  ЗАДАНИЕ
 *  1. Создайте замороженный объект PRIORITY со значениями-строками
 *     'low', 'medium', 'high'.
 *  2. priorityWeight(p) возвращает вес: low → 1, medium → 2, high → 3,
 *     неизвестное значение → -1.
 *  3. isPriority(x) возвращает true только для трёх допустимых строк.
 *
 *  ПОДСКАЗКИ
 *  - Object.freeze не даёт добавить/изменить свойства.
 *  - Object.values(PRIORITY) даёт массив значений.
 *
 *  ЛОВУШКА
 *  В Java enum — это тип. В JS это обычный объект: TypeScript позже
 *  добавит проверку типов, но во время выполнения значения не защищены.
 * ═══════════════════════════════════════════════════════════
 */

/** @typedef {'low'|'medium'|'high'} Priority */

/** @type {Readonly<{ LOW: Priority, MEDIUM: Priority, HIGH: Priority }>} */
export const PRIORITY = Object.freeze(
  /** @type {Readonly<{ LOW: Priority, MEDIUM: Priority, HIGH: Priority }>} */ ({
    // TODO 1.1.1: заполните значения
  }),
);

/**
 * @param {string} priority
 * @returns {number}
 */
export function priorityWeight(priority) {
  throw new Error('TODO 1.1.2: not implemented');
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isPriority(value) {
  throw new Error('TODO 1.1.3: not implemented');
}
