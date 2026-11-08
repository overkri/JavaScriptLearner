/**
 * Эталон модуля 9.3 — middleware.
 */

/**
 * @typedef {{ getState: () => any, dispatch: (action: any) => any }} StoreLike
 * @typedef {{ getItem: (key: string) => string|null, setItem: (key: string, value: string) => void, removeItem: (key: string) => void }} StorageLike
 * @typedef {(store: StoreLike) => (next: (action: any) => any) => (action: any) => any} Middleware
 */

/** @type {Middleware} */
export const logger = (store) => (next) => (action) => {
  const label = typeof action === 'function' ? 'thunk' : action?.type ?? 'unknown';
  console.group(`[store] ${label}`);
  console.log('before', store.getState());
  const result = next(action);
  console.log('after', store.getState());
  console.groupEnd();
  return result;
};

/**
 * @param {string} key
 * @param {StorageLike} [storage]
 * @returns {Middleware}
 */
export function persist(key, storage = globalThis.localStorage) {
  return (store) => (next) => (action) => {
    const result = next(action);
    try {
      storage.setItem(key, JSON.stringify(store.getState()));
    } catch {
      // Переполнение квоты или циклические данные не должны ломать dispatch.
    }
    return result;
  };
}

/** @type {Middleware} */
export const asyncThunk = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};
