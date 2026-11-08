/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 11 · УПРАЖНЕНИЕ 11.3 — Bug hunt: гонка запросов
 * ═══════════════════════════════════════════════════════════
 *  Симптом: медленный ответ на старый запрос перезаписывает
 *  результаты нового поиска. Введите «ab», быстро сотрите до «a» —
 *  и на экране окажутся результаты «ab».
 *  Тесты:   npx vitest run tests/m11/bughunt.test.js
 *  Уровень: ★★★
 *
 *  ЗАДАНИЕ
 *  Исправьте createSearchBug: onResult должен получать только
 *  результат САМОГО ПОСЛЕДНЕГО запроса. Внутренний счётчик
 *  запросов (sequence id) — достаточное решение.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @param {(query: string) => Promise<any>} fetchFn
 * @param {(result: any, query: string) => void} onResult
 * @returns {(query: string) => Promise<void>}
 */
export function createSearchBug(fetchFn, onResult) {
  return async (query) => {
    const result = await fetchFn(query);
    // FIXME(11.3): устаревший ответ перезаписывает свежий.
    onResult(result, query);
  };
}
