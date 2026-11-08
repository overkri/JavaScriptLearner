/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 10 · УПРАЖНЕНИЕ 10.2 — Локализация и плюрализация
 * ═══════════════════════════════════════════════════════════
 *  Тема:           Intl.DateTimeFormat, RelativeTimeFormat, PluralRules
 *  Java-аналогия:  DateTimeFormatter + MessageFormat, но ICU встроен
 *  Тесты:          npx vitest run tests/m10/intl.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  1. formatDate(iso, locale = 'ru-RU') — «1 декабря 2026 г.»
 *     (Intl.DateTimeFormat: day numeric, month long, year numeric).
 *     Невалидная дата → ''.
 *  2. formatRelative(iso, now = new Date(), locale = 'ru-RU') —
 *     разница в календарных днях через Intl.RelativeTimeFormat:
 *     «через 3 дня», «вчера», «сегодня».
 *  3. pluralizeTasks(n, locale = 'ru-RU') — «1 задача», «2 задачи»,
 *     «5 задач», «11 задач», «21 задача», «101 задача», «0 задач».
 *     Используйте Intl.PluralRules, а не цепочки if.
 *
 *  ПОДСКАЗКА
 *  Для формата YYYY-MM-DD создавайте дату через
 *  new Date(year, month - 1, day) — иначе UTC сдвинет день.
 *  PluralRules.select(n) возвращает 'one' | 'few' | 'many' | 'other'.
 *
 *  ЛОВУШКА
 *  new Date('2026-12-01') — это UTC-полночь. В часовом поясе западнее
 *  UTC дата может отобразиться как 30 ноября.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @param {string|Date} iso
 * @param {string} [locale]
 * @returns {string}
 */
export function formatDate(iso, locale = 'ru-RU') {
  throw new Error('TODO 10.2.1: not implemented');
}

/**
 * @param {string|Date} iso
 * @param {Date} [now]
 * @param {string} [locale]
 * @returns {string}
 */
export function formatRelative(iso, now = new Date(), locale = 'ru-RU') {
  throw new Error('TODO 10.2.2: not implemented');
}

/**
 * @param {number} n
 * @param {string} [locale]
 * @returns {string}
 */
export function pluralizeTasks(n, locale = 'ru-RU') {
  throw new Error('TODO 10.2.3: not implemented');
}
