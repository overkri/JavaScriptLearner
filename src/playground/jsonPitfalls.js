/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 8 · УПРАЖНЕНИЕ 8.4 — Quiz: ловушки JSON
 * ═══════════════════════════════════════════════════════════
 *  Тема:           JSON.stringify/parse: undefined, функции, Date,
 *                  toJSON, Map, NaN
 *  Java-аналогия:  Jackson молча теряет часть типов — JSON не богаче
 *  Тесты:          npx vitest run tests/m08/jsonPitfalls.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  Запишите прогнозы (результаты — строки JSON или примитивы):
 *    undefinedProperty  — JSON.stringify({ a: undefined })
 *    undefinedInArray   — JSON.stringify([undefined, () => {}])
 *    dateString         — JSON.stringify(new Date(0))
 *    parsedDateIsString — typeof JSON.parse(JSON.stringify(new Date(0)))
 *                         === 'string'? (boolean)
 *    customToJSON       — JSON.stringify({ toJSON: () => ({ x: 1 }) })
 *    mapBecomesEmpty    — JSON.stringify(new Map([['a', 1]]))
 *    nanBecomesNull     — JSON.stringify(NaN)
 *
 *  ПОДСКАЗКА
 *  JSON.stringify вызывает toJSON(), если он есть. Date.toJSON
 *  возвращает строку. Map/Set не поддерживаются.
 * ═══════════════════════════════════════════════════════════
 */

/** @type {Record<string, unknown>} */
export const predictions = {
  // TODO 8.4: заполните 7 прогнозов
};
