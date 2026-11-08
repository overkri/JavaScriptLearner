/**
 * Эталон модуля 7.1 — асинхронные утилиты.
 */

export class TimeoutError extends Error {
  /** @param {string} [message] */
  constructor(message = 'Operation timed out') {
    super(message);
    this.name = 'TimeoutError';
    this.code = 'TIMEOUT';
  }
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * @template T
 * @param {Promise<T>} promise
 * @param {number} ms
 * @param {string} [message]
 * @returns {Promise<T>}
 */
export function withTimeout(promise, ms, message) {
  /** @type {ReturnType<typeof setTimeout>|null} */
  let timer = null;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new TimeoutError(message));
    }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer !== null) clearTimeout(timer);
  });
}

/**
 * @template T
 * @param {() => Promise<T>|T} fn
 * @param {{ retries?: number, delayMs?: number, factor?: number, shouldRetry?: (error: any, attempt: number) => boolean }} [options]
 * @returns {Promise<T>}
 */
export function retry(fn, options = {}) {
  const {
    retries = 3,
    delayMs = 100,
    factor = 2,
    shouldRetry = () => true,
  } = options;

  return (async () => {
    let attempt = 0;
    /** @type {any} */
    let lastError;

    while (attempt <= retries) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (attempt >= retries || !shouldRetry(error, attempt + 1)) {
          throw error;
        }
        await sleep(delayMs * factor ** attempt);
        attempt += 1;
      }
    }

    throw lastError;
  })();
}

/**
 * @template {(...args: any[]) => void} F
 * @param {F} cbFn
 * @returns {(...args: any[]) => Promise<any>}
 */
export function promisify(cbFn) {
  /** @type {any} */
  const promisified = function (...args) {
    return new Promise((resolve, reject) => {
      cbFn.call(this, ...args, (error, value) => {
        if (error) reject(error);
        else resolve(value);
      });
    });
  };
  return promisified;
}

/**
 * @template T
 * @param {Array<() => Promise<T>|T>} tasks
 * @returns {Promise<T[]>}
 */
export async function runSequential(tasks) {
  /** @type {T[]} */
  const results = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

/**
 * @template T
 * @param {Array<() => Promise<T>|T>} tasks
 * @param {number} [limit]
 * @returns {Promise<T[]>}
 */
export async function runParallel(tasks, limit = Infinity) {
  const concurrency = Math.max(1, Math.min(limit, tasks.length));
  if (tasks.length === 0) return [];

  /** @type {T[]} */
  const results = new Array(tasks.length);
  let nextIndex = 0;

  const worker = async () => {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= tasks.length) return;
      results[index] = await tasks[index]();
    }
  };

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}
