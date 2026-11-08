/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 3 · УПРАЖНЕНИЕ 3.7 — Quiz: ссылки и копирование
 * ═══════════════════════════════════════════════════════════
 *  Тема:           ссылки vs значения, shallow/deep copy, Object.is
 *  Java-аналогия:  передача ссылки на объект; клонирование record
 *                  поверхностное, если поля — ссылки
 *  Тесты:          npx vitest run tests/m03/refQuiz.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  Запишите прогнозы, затем запустите тест. Ключи:
 *    sharedReference        — a.x после изменения через b = a
 *    shallowArrayCopy       — arr.length после push в [...arr]
 *    shallowNestedCopy      — a.n.v после изменения b.n.v, где b = {...a}
 *    objectIsNaN            — Object.is(NaN, NaN)
 *    objectIsNegativeZero   — Object.is(0, -0)
 *    structuredCloneDeep    — a.n.v после изменения глубокой копии
 *
 *  ЛОВУШКА
 *  Spread копирует только верхний уровень: вложенный объект остаётся
 *  общим. Для глубокой копии — structuredClone.
 * ═══════════════════════════════════════════════════════════
 */

/** @type {Record<string, unknown>} */
export const predictions = {
  // TODO 3.7: заполните 6 прогнозов
};
