import { describe, expect, it, vi } from 'vitest';
import { createStorage } from '../../src/storage/localStorageAdapter.js';

/** @returns {StorageLike & { data: Map<string, string> }} */
function memoryStorage() {
  const data = new Map();
  return {
    data,
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
}

describe('createStorage', () => {
  it('saves and loads JSON values', () => {
    const storage = memoryStorage();
    const store = createStorage('tasks', { storage, defaultValue: [] });
    expect(store.save([{ id: '1' }])).toBe(true);
    expect(store.load()).toEqual([{ id: '1' }]);
  });

  it('returns the default value when the key is missing', () => {
    const storage = memoryStorage();
    expect(createStorage('missing', { storage, defaultValue: { tasks: [] } }).load()).toEqual({
      tasks: [],
    });
    expect(createStorage('missing', { storage }).load()).toBeNull();
  });

  it('returns the default value for corrupted JSON', () => {
    const storage = memoryStorage();
    storage.setItem('broken', '{not json');
    expect(createStorage('broken', { storage, defaultValue: [] }).load()).toEqual([]);
  });

  it('returns false when saving fails (quota or circular data)', () => {
    const storage = memoryStorage();
    const failing = {
      ...storage,
      setItem: vi.fn(() => {
        throw new Error('QuotaExceededError');
      }),
    };
    const store = createStorage('key', { storage: failing });
    expect(store.save({ ok: true })).toBe(false);

    const circular = createStorage('key', { storage: memoryStorage() });
    const data = {};
    data.self = data;
    expect(circular.save(data)).toBe(false);
  });

  it('removes the key when saving undefined', () => {
    const storage = memoryStorage();
    const store = createStorage('key', { storage });
    store.save({ a: 1 });
    expect(store.save(undefined)).toBe(true);
    expect(storage.getItem('key')).toBeNull();
  });

  it('clears the key', () => {
    const storage = memoryStorage();
    const store = createStorage('key', { storage });
    store.save({ a: 1 });
    store.clear();
    expect(storage.getItem('key')).toBeNull();
  });

  it('throws without a usable storage', () => {
    expect(() => createStorage('key', { storage: null })).toThrow(TypeError);
  });
});
