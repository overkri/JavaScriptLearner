/**
 * Эталон модуля 1.3 — валидаторы.
 */

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * @typedef {{ ok: boolean, error?: string }} ValidationResult
 */

/**
 * @param {unknown} title
 * @returns {ValidationResult}
 */
export function validateTitle(title) {
  if (typeof title !== 'string') {
    return { ok: false, error: 'Заголовок должен быть строкой' };
  }
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: 'Заголовок не может быть пустым' };
  }
  if (trimmed.length > 80) {
    return { ok: false, error: 'Заголовок длиннее 80 символов' };
  }
  return { ok: true };
}

/**
 * @param {unknown} value
 * @returns {ValidationResult}
 */
export function validateDueDate(value) {
  if (value === null || value === undefined || value === '') {
    return { ok: true };
  }
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { ok: false, error: 'Дата должна быть в формате YYYY-MM-DD' };
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return { ok: false, error: 'Такой даты не существует' };
  }
  return { ok: true };
}
