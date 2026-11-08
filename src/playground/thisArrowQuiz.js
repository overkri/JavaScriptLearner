/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 2 · УПРАЖНЕНИЕ 2.4 — Quiz: обычные и стрелочные функции
 * ═══════════════════════════════════════════════════════════
 *  Тема:           лексический this, отсутствие arguments, new
 *  Java-аналогия:  лямбда в Java захватывает this внешнего класса —
 *                  стрелка в JS ведёт себя похоже
 *  Тесты:          npx vitest run tests/m02/thisArrowQuiz.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  1. Заполните predictions:
 *     - regularMethodCall — результат obj.getName() для обычного метода;
 *     - arrowCapturesOuterThis — что вернёт стрелка, созданная в методе
 *       объекта { name: 'outer' } и читающая this.name;
 *     - arrowHasNoArguments — что вернёт стрелка внутри обычной функции,
 *       если она читает arguments.length, а внешнюю вызвали с 2 аргументами;
 *     - arrowCannotBeNew — true, если `new (() => {})` бросает TypeError.
 *  2. createLexicalThisCounter() — объект с полем count и методом run(),
 *     который внутри использует стрелку, чтобы увеличить this.count
 *     три раза и вернуть итог.
 *
 *  ПОДСКАЗКА
 *  У стрелки нет собственных this/arguments — она берёт их из места
 *  создания (лексически).
 * ═══════════════════════════════════════════════════════════
 */

/** @type {Record<string, unknown>} */
export const predictions = {
  // TODO 2.4.1: regularMethodCall, arrowCapturesOuterThis,
  //             arrowHasNoArguments, arrowCannotBeNew
};

/**
 * @returns {{ count: number, run: () => number }}
 */
export function createLexicalThisCounter() {
  throw new Error('TODO 2.4.2: not implemented');
}
