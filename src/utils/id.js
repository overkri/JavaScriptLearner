/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 2 · УПРАЖНЕНИЕ 2.1 — Генераторы идентификаторов
 * ═══════════════════════════════════════════════════════════
 *  Тема:           замыкания, функции как значения, crypto.randomUUID
 *  Java-аналогия:  AtomicLong + Supplier<String>
 *  Тесты:          npx vitest run tests/m02/id.test.js
 *  Уровень:        ★☆☆
 *
 *  ЗАДАНИЕ
 *  1. createIdGenerator(prefix = 'task') возвращает функцию без аргументов.
 *     Каждый вызов даёт строки task-1, task-2, task-3, ...
 *  2. Два генератора имеют независимые счётчики. Счётчик нельзя
 *     прочитать или изменить снаружи (никаких глобальных переменных).
 *  3. uid() возвращает строку из crypto.randomUUID().
 *
 *  ПОДСКАЗКА
 *  Переменная, объявленная внутри createIdGenerator, живёт в замыкании
 *  возвращаемой функции — это и есть «приватное поле».
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @param {string} [prefix]
 * @returns {() => string}
 */
export function createIdGenerator(prefix = 'task') {
  throw new Error('TODO 2.1.1: not implemented');
}

/**
 * @returns {string}
 */
export function uid() {
  throw new Error('TODO 2.1.2: not implemented');
}
