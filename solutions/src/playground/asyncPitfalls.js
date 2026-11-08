/**
 * Эталон модуля 7.6 — исправленные async-паттерны.
 */

/**
 * @template T, R
 * @param {T[]} items
 * @param {(item: T, index: number) => Promise<R>|R} fn
 * @returns {Promise<R[]>}
 */
export function mapAsync(items, fn) {
  return Promise.all(items.map((item, index) => fn(item, index)));
}

/**
 * @template T, R
 * @param {T[]} items
 * @param {(item: T, index: number) => Promise<R>|R} fn
 * @returns {Promise<R[]>}
 */
export async function eachSeries(items, fn) {
  /** @type {R[]} */
  const results = [];
  for (const [index, item] of items.entries()) {
    results.push(await fn(item, index));
  }
  return results;
}

/**
 * @param {Array<Promise<any>>} promises
 * @returns {Promise<Array<{ status: 'fulfilled'|'rejected', value?: any, reason?: any }>>}
 */
export function settleAll(promises) {
  return Promise.allSettled(promises);
}

/**
 * @template {(...args: any[]) => Promise<any>|any} F
 * @param {F} fn
 * @returns {(...args: Parameters<F>) => Promise<{ ok: true, value: any }|{ ok: false, error: any }>}
 */
export function safeAsync(fn) {
  /** @type {any} */
  const safe = async (...args) => {
    try {
      return { ok: true, value: await fn(...args) };
    } catch (error) {
      return { ok: false, error };
    }
  };
  return safe;
}
