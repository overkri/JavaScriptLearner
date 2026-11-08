/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 10 · УПРАЖНЕНИЕ 10.3 — Генераторы и ленивые операции
 * ═══════════════════════════════════════════════════════════
 *  Тема:           function*, yield, ленивые итераторы, return
 *  Java-аналогия:  Stream/Iterator, но генератор сам хранит состояние
 *  Тесты:          npx vitest run tests/m10/pagination.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  1. function* paginate(items, size) — страницы по size элементов,
 *     последняя может быть неполной. size <= 0 → RangeError (при итерации).
 *  2. function* range(start, end, step = 1) — как Python range,
 *     end не включается; step 0 → RangeError; шаг может быть отрицательным.
 *  3. function* take(iterable, n) — первые n элементов, не больше.
 *  4. function* mapIter(iterable, fn) — ленивый map.
 *  5. function* filterIter(iterable, predicate) — ленивый filter.
 *
 *  ТРЕБОВАНИЯ
 *  - Ленивость: take(range(...), 3) не должен вычислять больше 3 значений.
 *  - Генератор должен корректно завершаться через return().
 *
 *  ПОДСКАЗКА
 *  В generator-функции нельзя писать return value до первого yield?
 *  Можно: `if (n <= 0) return;` просто завершит итератор.
 *
 *  ЛОВУШКА
 *  Array.prototype.map вычисляет весь массив сразу. Для бесконечных
 *  последовательностей нужны генераторы.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @template T
 * @param {T[]} items
 * @param {number} size
 * @returns {Generator<T[]>}
 */
export function* paginate(items, size) {
  throw new Error('TODO 10.3.1: not implemented');
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} [step]
 * @returns {Generator<number>}
 */
export function* range(start, end, step = 1) {
  throw new Error('TODO 10.3.2: not implemented');
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number} n
 * @returns {Generator<T>}
 */
export function* take(iterable, n) {
  throw new Error('TODO 10.3.3: not implemented');
}

/**
 * @template T, R
 * @param {Iterable<T>} iterable
 * @param {(value: T, index: number) => R} fn
 * @returns {Generator<R>}
 */
export function* mapIter(iterable, fn) {
  throw new Error('TODO 10.3.4: not implemented');
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {(value: T, index: number) => boolean} predicate
 * @returns {Generator<T>}
 */
export function* filterIter(iterable, predicate) {
  throw new Error('TODO 10.3.5: not implemented');
}
