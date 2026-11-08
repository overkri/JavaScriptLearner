/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 2 · УПРАЖНЕНИЕ 2.3 — Quiz: замыкания
 * ═══════════════════════════════════════════════════════════
 *  Тема:           замыкание, var vs let в цикле, IIFE, счётчик
 *  Java-аналогия:  анонимный класс с полем; но в Java переменная
 *                  цикла effectively final, а var в JS — одна на всех
 *  Тесты:          npx vitest run tests/m02/closureQuiz.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  1. predictions: что вернут массивы функций, созданные в цикле
 *     с var и с let? Ключи: varLoop, letLoop.
 *  2. createCounter(start = 0) — объект с методами increment(),
 *     decrement(), reset() и геттером value. Состояние — в замыкании.
 *  3. fixLoopWithLet() и fixLoopWithIife() — вернуть [0, 1, 2],
 *     создав функции в цикле (в первом случае let, во втором var+IIFE).
 *
 *  ПОДСКАЗКА
 *  let создаёт новую привязку на каждой итерации, var — одну на цикл.
 * ═══════════════════════════════════════════════════════════
 */

/** @type {Record<string, unknown>} */
export const predictions = {
  // TODO 2.3.1: varLoop, letLoop
};

/**
 * @param {number} [start]
 * @returns {{ increment: () => number, decrement: () => number, reset: () => number, readonly value: number }}
 */
export function createCounter(start = 0) {
  throw new Error('TODO 2.3.2: not implemented');
}

/** @returns {number[]} */
export function fixLoopWithLet() {
  throw new Error('TODO 2.3.3: not implemented');
}

/** @returns {number[]} */
export function fixLoopWithIife() {
  throw new Error('TODO 2.3.4: not implemented');
}
