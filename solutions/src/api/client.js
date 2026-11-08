/**
 * Эталон модуля 7.2 — HTTP-клиент.
 */

import { NetworkError, NotFoundError } from '../core/errors.js';
import { TimeoutError, withTimeout } from '../utils/async.js';
import { fakeFetch } from './fakeServer.js';

/**
 * @param {string} url
 * @param {{ method?: string, body?: any, signal?: AbortSignal, timeoutMs?: number, fetchImpl?: typeof fetch }} [options]
 * @returns {Promise<any>}
 */
export async function request(url, options = {}) {
  const {
    method = 'GET',
    body,
    signal,
    timeoutMs = 10000,
    fetchImpl = /** @type {typeof fetch} */ (fakeFetch),
  } = options;

  /** @type {Record<string, string>} */
  const headers = { Accept: 'application/json' };
  /** @type {RequestInit} */
  const init = { method, headers, signal };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await withTimeout(fetchImpl(url, init), timeoutMs);
  } catch (error) {
    if (error instanceof TimeoutError) throw error;
    if (/** @type {any} */ (error)?.name === 'AbortError') throw error;
    throw new NetworkError(
      /** @type {any} */ (error)?.message ?? 'Network request failed',
      0,
      { cause: error },
    );
  }

  /** @type {any} */
  let data = null;
  if (response.status !== 204) {
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
  }

  if (response.status === 404) {
    throw new NotFoundError(data?.error ?? 'Resource not found', { cause: data });
  }

  if (!response.ok) {
    throw new NetworkError(
      data?.error ?? `Request failed with status ${response.status}`,
      response.status,
      { cause: data },
    );
  }

  return data;
}
