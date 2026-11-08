/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 9 · УПРАЖНЕНИЕ 9.3 — Middleware
 * ═══════════════════════════════════════════════════════════
 *  Тема:           цепочка middleware, побочные эффекты, thunk
 *  Java-аналогия:  перехватчики (interceptors) вокруг команды
 *  Тесты:          npx vitest run tests/m09/middleware.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  Реализуйте три middleware вида (store) => (next) => (action) => ...
 *  1. logger — до next выведите group/log с action.type и state,
 *     после next — новый state, затем groupEnd. Верните результат next.
 *  2. persist(key, storage = localStorage) — после успешного next
 *     сохраните JSON.stringify(store.getState()) в storage.
 *     Ошибки сериализации/записи не должны ломать dispatch.
 *  3. asyncThunk — если action — функция, вызовите её как
 *     action(store.dispatch, store.getState) и верните результат;
 *     иначе передайте action дальше.
 *
 *  ПОДСКАЗКА
 *  Middleware не должен вызывать reducer напрямую — только next(action).
 *
 *  ЛОВУШКА
 *  Если persist сделать ДО next, сохранится старое состояние.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {{ getState: () => any, dispatch: (action: any) => any }} StoreLike
 * @typedef {{ getItem: (key: string) => string|null, setItem: (key: string, value: string) => void, removeItem: (key: string) => void }} StorageLike
 * @typedef {(store: StoreLike) => (next: (action: any) => any) => (action: any) => any} Middleware
 */

/** @type {Middleware} */
export const logger = (store) => (next) => (action) => {
  throw new Error('TODO 9.3.1: not implemented');
};

/**
 * @param {string} key
 * @param {StorageLike} [storage]
 * @returns {Middleware}
 */
export function persist(key, storage = globalThis.localStorage) {
  throw new Error('TODO 9.3.2: not implemented');
}

/** @type {Middleware} */
export const asyncThunk = (store) => (next) => (action) => {
  throw new Error('TODO 9.3.3: not implemented');
};
