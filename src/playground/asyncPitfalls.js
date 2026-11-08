/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 7 · УПРАЖНЕНИЕ 7.6 — Ловушки async/await и их исправления
 * ═══════════════════════════════════════════════════════════
 *  Тема:           forEach+await, последовательность vs параллельность,
 *                  rejected promises, безопасные обёртки
 *  Java-аналогия:  CompletableFuture.allOf vs последовательный then
 *  Тесты:          npx vitest run tests/m07/asyncPitfalls.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  1. mapAsync(items, fn) — параллельно, результаты в исходном порядке
 *     (Promise.all, НЕ forEach).
 *  2. eachSeries(items, fn) — строго последовательно, результаты по порядку
 *     (for...of + await).
 *  3. settleAll(promises) — верните результат Promise.allSettled,
 *     не падая на rejected.
 *  4. safeAsync(fn) — обёртка: при успехе { ok: true, value },
 *     при ошибке { ok: false, error }. Ошибка не должна улетать наружу.
 *
 *  ЛОВУШКА
 *  array.forEach(async () => await ...) не ждёт завершения: forEach
 *  игнорирует возвращённые промисы. Используйте map + Promise.all
 *  или for...of.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @template T, R
 * @param {T[]} items
 * @param {(item: T, index: number) => Promise<R>|R} fn
 * @returns {Promise<R[]>}
 */
export function mapAsync(items, fn) {
  throw new Error('TODO 7.6.1: not implemented');
}

/**
 * @template T, R
 * @param {T[]} items
 * @param {(item: T, index: number) => Promise<R>|R} fn
 * @returns {Promise<R[]>}
 */
export function eachSeries(items, fn) {
  throw new Error('TODO 7.6.2: not implemented');
}

/**
 * @param {Array<Promise<any>>} promises
 * @returns {Promise<Array<{ status: 'fulfilled'|'rejected', value?: any, reason?: any }>>}
 */
export function settleAll(promises) {
  throw new Error('TODO 7.6.3: not implemented');
}

/**
 * @template {(...args: any[]) => Promise<any>|any} F
 * @param {F} fn
 * @returns {(...args: Parameters<F>) => Promise<{ ok: true, value: any }|{ ok: false, error: any }>}
 */
export function safeAsync(fn) {
  throw new Error('TODO 7.6.4: not implemented');
}
