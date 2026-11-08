/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 7 · УПРАЖНЕНИЕ 7.2 — HTTP-клиент поверх fakeFetch
 * ═══════════════════════════════════════════════════════════
 *  Тема:           fetch, Response, JSON, ошибки, AbortController
 *  Java-аналогия:  RestClient/HttpClient + маппинг статусов в исключения
 *  Тесты:          npx vitest run tests/m07/client.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  request(url, { method='GET', body, signal, timeoutMs=10000, fetchImpl })
 *  → Promise<parsed JSON | null>.
 *  Требования:
 *  - body сериализуется в JSON, заголовок Content-Type;
 *  - response.ok === false:
 *      404 → NotFoundError,
 *      остальные → NetworkError с полем status;
 *  - 204 → null; ошибка сети (fetch reject) → NetworkError с cause;
 *  - timeoutMs → withTimeout + TimeoutError;
 *  - AbortError от signal пробрасывается как есть;
 *  - fetchImpl по умолчанию — fakeFetch (в тестах можно подменить).
 *
 *  ПОДСКАЗКА
 *  Сначала проверьте response.ok, потом читайте тело.
 *  Текст ошибки сервера лежит в JSON { error }.
 *
 *  ЛОВУШКА
 *  fetch не бросает исключение на 404/500 — проверять ok обязательно.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @param {string} url
 * @param {{ method?: string, body?: any, signal?: AbortSignal, timeoutMs?: number, fetchImpl?: typeof fetch }} [options]
 * @returns {Promise<any>}
 */
export function request(url, options = {}) {
  throw new Error('TODO 7.2: not implemented');
}
