/**
 * Эталон модуля 7.7 — живой поиск с отменой устаревших запросов.
 */

import { debounce } from '../../utils/functional.js';

/**
 * @typedef {(query: string, signal: AbortSignal) => Promise<any>} SearchFn
 */

/**
 * @param {{ search: SearchFn, onResults?: (results: any, query: string) => void, onError?: (error: any, query: string) => void, delay?: number }} options
 * @returns {{ search: (query: string) => void, cancel: () => void }}
 */
export function createLiveSearch({ search, onResults, onError, delay = 300 }) {
  if (typeof search !== 'function') throw new TypeError('search must be a function');

  /** @type {AbortController|null} */
  let controller = null;

  const run = debounce(async (query) => {
    controller?.abort();
    controller = new AbortController();
    const current = controller;

    try {
      const results = await search(query, current.signal);
      if (!current.signal.aborted) {
        onResults?.(results, query);
      }
    } catch (error) {
      if (!current.signal.aborted && /** @type {any} */ (error)?.name !== 'AbortError') {
        onError?.(error, query);
      }
    }
  }, delay);

  return {
    /** @param {string} query */
    search(query) {
      run(String(query));
    },
    cancel() {
      run.cancel();
      controller?.abort();
      controller = null;
    },
  };
}
