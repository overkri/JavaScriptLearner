/**
 * Эталон модуля 10.2 — Intl.
 */

/**
 * @param {string|Date} value
 * @returns {Date|null}
 */
function toDate(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value !== 'string') return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * @param {string|Date} iso
 * @param {string} [locale]
 * @returns {string}
 */
export function formatDate(iso, locale = 'ru-RU') {
  const date = toDate(iso);
  if (!date) return '';
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * @param {string|Date} iso
 * @param {Date} [now]
 * @param {string} [locale]
 * @returns {string}
 */
export function formatRelative(iso, now = new Date(), locale = 'ru-RU') {
  const date = toDate(iso);
  if (!date) return '';

  const targetDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const nowDay = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((targetDay - nowDay) / 86_400_000);

  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(diffDays, 'day');
}

/**
 * @param {number} n
 * @param {string} [locale]
 * @returns {string}
 */
export function pluralizeTasks(n, locale = 'ru-RU') {
  const absolute = Math.abs(n);
  const rule = new Intl.PluralRules(locale).select(absolute);
  /** @type {Record<string, string>} */
  const forms = {
    one: 'задача',
    few: 'задачи',
    many: 'задач',
    other: 'задачи',
  };
  return `${n} ${forms[rule] ?? forms.other}`;
}
