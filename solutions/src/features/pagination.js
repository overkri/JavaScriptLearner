/**
 * Эталон модуля 10.3 — генераторы.
 */

/**
 * @template T
 * @param {T[]} items
 * @param {number} size
 * @returns {Generator<T[]>}
 */
export function* paginate(items, size) {
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError('size must be a positive integer');
  }
  for (let index = 0; index < items.length; index += size) {
    yield items.slice(index, index + size);
  }
}

/**
 * @param {number} start
 * @param {number} end
 * @param {number} [step]
 * @returns {Generator<number>}
 */
export function* range(start, end, step = 1) {
  if (step === 0) throw new RangeError('step must not be zero');
  if (step > 0) {
    for (let value = start; value < end; value += step) yield value;
  } else {
    for (let value = start; value > end; value += step) yield value;
  }
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number} n
 * @returns {Generator<T>}
 */
export function* take(iterable, n) {
  if (n <= 0) return;
  let count = 0;
  for (const value of iterable) {
    yield value;
    count += 1;
    if (count >= n) return;
  }
}

/**
 * @template T, R
 * @param {Iterable<T>} iterable
 * @param {(value: T, index: number) => R} fn
 * @returns {Generator<R>}
 */
export function* mapIter(iterable, fn) {
  let index = 0;
  for (const value of iterable) {
    yield fn(value, index);
    index += 1;
  }
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {(value: T, index: number) => boolean} predicate
 * @returns {Generator<T>}
 */
export function* filterIter(iterable, predicate) {
  let index = 0;
  for (const value of iterable) {
    if (predicate(value, index)) yield value;
    index += 1;
  }
}
