/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 7 · УПРАЖНЕНИЕ 7.7 — Живой поиск: debounce + отмена
 * ═══════════════════════════════════════════════════════════
 *  Тема:           гонки запросов, AbortController, debounce
 *  Java-аналогия:  отмена устаревшего запроса; last-write-wins
 *  Тесты:          npx vitest run tests/m07/liveSearch.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  createLiveSearch({ search, onResults, onError, delay = 300 }) →
 *  { search(query), cancel() }.
 *  - search(query) дебаунсит вызов searchFn;
 *  - перед новым запросом отменяет предыдущий через AbortController;
 *  - searchFn(query, signal) возвращает промис;
 *  - onResults(results, query) вызывается только для САМОГО СВЕЖЕГО
 *    запроса; устаревший ответ (даже если пришёл позже) игнорируется;
 *  - onError(error, query) — для ошибок свежего запроса; AbortError
 *    не показываем;
 *  - cancel() отменяет таймер и текущий запрос.
 *
 *  ПОДСКАЗКА
 *  Используйте debounce из utils/functional.js и проверяйте
 *  signal.aborted перед вызовом колбэков.
 *
 *  ЛОВУШКА
 *  Без AbortController медленный ответ на «a» может перезаписать
 *  результаты более нового «ab».
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {(query: string, signal: AbortSignal) => Promise<any>} SearchFn
 */

/**
 * @param {{ search: SearchFn, onResults?: (results: any, query: string) => void, onError?: (error: any, query: string) => void, delay?: number }} options
 * @returns {{ search: (query: string) => void, cancel: () => void }}
 */
export function createLiveSearch(options) {
  throw new Error('TODO 7.7: not implemented');
}
