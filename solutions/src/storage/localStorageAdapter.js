/**
 * Эталон модуля 8.1 — адаптер хранилища.
 */

/**
 * @typedef {{ getItem: (key: string) => string|null, setItem: (key: string, value: string) => void, removeItem: (key: string) => void }} StorageLike
 */

/**
 * @template T
 * @param {string} key
 * @param {{ storage?: StorageLike, defaultValue?: T }} [options]
 * @returns {{ load: () => T, save: (value: T) => boolean, clear: () => void }}
 */
export function createStorage(
  key,
  { storage = globalThis.window?.localStorage ?? globalThis.localStorage, defaultValue = null } = {},
) {
  if (!storage || typeof storage.getItem !== 'function') {
    throw new TypeError('Storage is not available');
  }

  return {
    load() {
      try {
        const raw = storage.getItem(key);
        if (raw === null) return /** @type {T} */ (defaultValue);
        return JSON.parse(raw);
      } catch {
        return /** @type {T} */ (defaultValue);
      }
    },

    save(value) {
      try {
        const raw = JSON.stringify(value);
        if (raw === undefined) {
          storage.removeItem(key);
        } else {
          storage.setItem(key, raw);
        }
        return true;
      } catch {
        return false;
      }
    },

    clear() {
      try {
        storage.removeItem(key);
      } catch {
        // Удаление не должно ронять приложение.
      }
    },
  };
}
