/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 1 · УПРАЖНЕНИЕ 1.3 — Валидаторы
 * ═══════════════════════════════════════════════════════════
 *  Тема:           truthy/falsy, строки, Date, объект-результат
 *  Java-аналогия:  Bean Validation, но без аннотаций и исключений
 *  Тесты:          npx vitest run tests/m01/validators.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  1. isNonEmptyString(x) — true только для строки с непробельным содержимым.
 *  2. validateTitle(title) → { ok: true } или { ok: false, error: string }.
 *     Ограничения: обрезанная длина от 1 до 80.
 *  3. validateDueDate(value) → { ok, error? }.
 *     null/undefined/'' — допустимо (дедлайна нет).
 *     Иначе строка строго YYYY-MM-DD и существующая календарная дата
 *     (2026-02-30 невалидна, 2028-02-29 валидна).
 *
 *  ПОДСКАЗКИ
 *  - Не полагайтесь на truthy: строка ' ' не пустая, а 0 — falsy.
 *  - Date автоматически переносит 30 февраля на 2 марта. Сравните
 *    toISOString().slice(0, 10) с исходной строкой.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isNonEmptyString(value) {
  throw new Error('TODO 1.3.1: not implemented');
}

/**
 * @typedef {{ ok: boolean, error?: string }} ValidationResult
 */

/**
 * @param {unknown} title
 * @returns {ValidationResult}
 */
export function validateTitle(title) {
  throw new Error('TODO 1.3.2: not implemented');
}

/**
 * @param {unknown} value
 * @returns {ValidationResult}
 */
export function validateDueDate(value) {
  throw new Error('TODO 1.3.3: not implemented');
}
