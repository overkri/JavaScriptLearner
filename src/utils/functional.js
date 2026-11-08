/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 2 · УПРАЖНЕНИЕ 2.2 — Функциональные утилиты
 * ═══════════════════════════════════════════════════════════
 *  Тема:           first-class functions, замыкания, this, аргументы
 *  Java-аналогия:  Function<T,R>, BiFunction, UnaryOperator, но с
 *                  сохранением состояния в замыкании
 *  Тесты:          npx vitest run tests/m02/functional.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  1. once(fn) — fn вызывается максимум один раз, возвращается первый
 *     результат; this и аргументы сохраняются.
 *  2. debounce(fn, ms) — вызов через ms после последнего вызова
 *     (trailing edge). Верните функцию с методом cancel().
 *  3. throttle(fn, ms) — не чаще одного раза за ms (leading edge).
 *  4. memoize(fn, keyFn = JSON.stringify) — кэш по ключу из аргументов;
 *     добавьте метод clear().
 *  5. pipe(...fns) — слева направо; первый получает все аргументы.
 *  6. compose(...fns) — справа налево.
 *  7. curry(fn) — каррирование по fn.length.
 *  8. partial(fn, ...preset) — частичное применение.
 *  9. tap(fn) — вызывает fn(value) и возвращает value (для pipe).
 * 10. not(predicate) — инвертирует предикат (для filter).
 *
 *  ПОДСКАЗКИ
 *  - Для сохранения this используйте fn.apply(this, args).
 *  - debounce: храните timer; при новом вызове clearTimeout.
 *  - curry: накапливайте аргументы, пока их не станет fn.length.
 *
 *  ЛОВУШКА
 *  Стрелочная функция не имеет своего this и arguments — для утилит,
 *  которые должны работать методами объекта, нужна обычная function.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @returns {F}
 */
export function once(fn) {
  throw new Error('TODO 2.2.1: not implemented');
}

/**
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @param {number} ms
 */
export function debounce(fn, ms) {
  throw new Error('TODO 2.2.2: not implemented');
}

/**
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @param {number} ms
 * @returns {F}
 */
export function throttle(fn, ms) {
  throw new Error('TODO 2.2.3: not implemented');
}

/**
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @param {(...args: any[]) => string} [keyFn]
 * @returns {F & { clear: () => void }}
 */
export function memoize(fn, keyFn = JSON.stringify) {
  throw new Error('TODO 2.2.4: not implemented');
}

/**
 * @template {(...args: any[]) => any} F
 * @param {...F} fns
 * @returns {(...args: any[]) => any}
 */
export function pipe(...fns) {
  throw new Error('TODO 2.2.5: not implemented');
}

/**
 * @param {...(...args: any[]) => any} fns
 * @returns {(...args: any[]) => any}
 */
export function compose(...fns) {
  throw new Error('TODO 2.2.6: not implemented');
}

/**
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @returns {(...args: any[]) => any}
 */
export function curry(fn) {
  throw new Error('TODO 2.2.7: not implemented');
}

/**
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @param {...any} preset
 * @returns {(...args: any[]) => any}
 */
export function partial(fn, ...preset) {
  throw new Error('TODO 2.2.8: not implemented');
}

/**
 * @template T
 * @param {(value: T) => unknown} fn
 * @returns {(value: T) => T}
 */
export function tap(fn) {
  throw new Error('TODO 2.2.9: not implemented');
}

/**
 * @template {(...args: any[]) => any} F
 * @param {F} predicate
 * @returns {(...args: Parameters<F>) => boolean}
 */
export function not(predicate) {
  throw new Error('TODO 2.2.10: not implemented');
}
