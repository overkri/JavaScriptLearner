/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 8 · УПРАЖНЕНИЕ 8.1 — Адаптер localStorage
 * ═══════════════════════════════════════════════════════════
 *  Тема:           try/catch, JSON, подмена зависимости в тестах
 *  Java-аналогия:  DAO с интерфейсом; в тестах — in-memory реализация
 *  Тесты:          npx vitest run tests/m08/localStorageAdapter.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  createStorage(key, { storage = localStorage, defaultValue = null }) →
 *  { load, save, clear }.
 *  - load(): читает JSON; если значения нет или JSON повреждён —
 *    возвращает defaultValue (не бросает);
 *  - save(value): сериализует и сохраняет; возвращает true/false
 *    (переполнение квоты, циклический объект — false);
 *  - JSON.stringify(undefined) → undefined: считайте это удалением ключа;
 *  - clear(): удаляет ключ.
 *
 *  ПОДСКАЗКА
 *  Тесты передают свой storage-объект с getItem/setItem/removeItem.
 *  Не обращайтесь к localStorage напрямую, если он передан.
 *
 *  ЛОВУШКА
 *  Повреждённый JSON в localStorage — обычное дело (старая версия,
 *  ручная правка). Приложение не должно падать на старте.
 * ═══════════════════════════════════════════════════════════
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
export function createStorage(key, options = {}) {
  throw new Error('TODO 8.1: not implemented');
}
