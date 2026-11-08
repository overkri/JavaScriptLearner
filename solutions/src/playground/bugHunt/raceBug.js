/**
 * Эталон модуля 11.3 — защита от гонки запросов.
 */

/**
 * @param {(query: string) => Promise<any>} fetchFn
 * @param {(result: any, query: string) => void} onResult
 * @returns {(query: string) => Promise<void>}
 */
export function createSearchBug(fetchFn, onResult) {
  let latestRequest = 0;

  return async (query) => {
    latestRequest += 1;
    const requestId = latestRequest;
    const result = await fetchFn(query);
    if (requestId === latestRequest) {
      onResult(result, query);
    }
  };
}
