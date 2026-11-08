/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 7 · УПРАЖНЕНИЕ 7.1 — Асинхронные утилиты
 * ═══════════════════════════════════════════════════════════
 *  Тема:           Promise, async/await, race, retry, concurrency
 *  Java-аналогия:  CompletableFuture, но event loop однопоточный
 *  Тесты:          npx vitest run tests/m07/async.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  1. sleep(ms) — промис, резолвящийся через ms.
 *  2. withTimeout(promise, ms, message?) — Promise.race с таймером;
 *     по истечении бросает TimeoutError (создайте класс, name='TimeoutError').
 *  3. retry(fn, { retries = 3, delayMs = 100, factor = 2, shouldRetry })
 *     — повторы с экспоненциальной задержкой. retries — число ПОВТОРОВ
 *     после первой попытки. shouldRetry(error, attempt) решает, продолжать ли.
 *  4. promisify(cbFn) — превращает error-first callback в промис.
 *  5. runSequential(tasks) — выполняет функции по очереди, результаты
 *     в исходном порядке.
 *  6. runParallel(tasks, limit) — параллельно, но не более limit
 *     одновременно; результаты в исходном порядке.
 *
 *  ПОДСКАЗКИ
 *  - В withTimeout очищайте таймер после settle, иначе тест «зависнет».
 *  - retry: await sleep(delayMs * factor ** attempt).
 *  - runParallel: несколько worker'ов берут индексы из общего счётчика.
 *
 *  ЛОВУШКА
 *  forEach не умеет await. Для последовательности — for...of,
 *  для параллельности — Promise.all / пул воркеров.
 * ═══════════════════════════════════════════════════════════
 */

export class TimeoutError extends Error {
  /** @param {string} [message] */
  constructor(message = 'Operation timed out') {
    super(message);
    throw new Error('TODO 7.1.0: not implemented');
  }
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  throw new Error('TODO 7.1.1: not implemented');
}

/**
 * @template T
 * @param {Promise<T>} promise
 * @param {number} ms
 * @param {string} [message]
 * @returns {Promise<T>}
 */
export function withTimeout(promise, ms, message) {
  throw new Error('TODO 7.1.2: not implemented');
}

/**
 * @template T
 * @param {() => Promise<T>|T} fn
 * @param {{ retries?: number, delayMs?: number, factor?: number, shouldRetry?: (error: any, attempt: number) => boolean }} [options]
 * @returns {Promise<T>}
 */
export function retry(fn, options = {}) {
  throw new Error('TODO 7.1.3: not implemented');
}

/**
 * @template {(...args: any[]) => void} F
 * @param {F} cbFn
 * @returns {(...args: any[]) => Promise<any>}
 */
export function promisify(cbFn) {
  throw new Error('TODO 7.1.4: not implemented');
}

/**
 * @template T
 * @param {Array<() => Promise<T>|T>} tasks
 * @returns {Promise<T[]>}
 */
export function runSequential(tasks) {
  throw new Error('TODO 7.1.5: not implemented');
}

/**
 * @template T
 * @param {Array<() => Promise<T>|T>} tasks
 * @param {number} [limit]
 * @returns {Promise<T[]>}
 */
export function runParallel(tasks, limit = Infinity) {
  throw new Error('TODO 7.1.6: not implemented');
}
