/**
 * Эталон модуля 8.3 — сериализация с поддержкой Date/Map/Set.
 */

/**
 * @param {any} tasks
 * @returns {string}
 */
export function serializeTasks(tasks) {
  try {
    return JSON.stringify(tasks, function replacer(key, value) {
      const original = this[key];
      if (original instanceof Date) {
        return { __type: 'Date', value: original.toISOString() };
      }
      if (original instanceof Set) {
        return { __type: 'Set', values: [...original] };
      }
      if (original instanceof Map) {
        return { __type: 'Map', entries: [...original.entries()] };
      }
      return value;
    });
  } catch (error) {
    if (error instanceof TypeError && /circular/i.test(error.message)) {
      throw new Error('Cannot serialize data: circular reference', { cause: error });
    }
    throw error;
  }
}

/**
 * @param {string} json
 * @returns {any}
 */
export function deserializeTasks(json) {
  return JSON.parse(json, (_key, value) => {
    if (value && typeof value === 'object') {
      if (value.__type === 'Date') return new Date(value.value);
      if (value.__type === 'Set') return new Set(value.values);
      if (value.__type === 'Map') return new Map(value.entries);
    }
    return value;
  });
}
