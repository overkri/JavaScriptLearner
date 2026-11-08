/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 10 · УПРАЖНЕНИЕ 10.1 — Парсер поисковых запросов
 * ═══════════════════════════════════════════════════════════
 *  Тема:           regex, именованные группы, matchAll, токенизация
 *  Java-аналогия:  свой мини-парсер DSL вместо регулярки-простыни
 *  Тесты:          npx vitest run tests/m10/queryParser.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  parseQuery('tag:work priority:high !done "buy milk" due:<2026-12-01')
 *  → { tags, priority, status, excludeStatus, text, dueBefore }
 *
 *  Правила:
 *  - tag:x — тег в lowercase; несколько тегов складываются, дубли убираются;
 *  - priority:low|medium|high — приоритет;
 *  - status:todo|in-progress|done — статус;
 *  - !done / !todo / !in-progress — исключаемый статус;
 *  - due:<YYYY-MM-DD — дедлайн раньше даты (допустим и due:YYYY-MM-DD);
 *  - "фраза в кавычках" — часть текста (пробелы сохраняются);
 *  - остальные слова — текст через пробел;
 *  - пустая строка → tags: [], text: '', остальные null.
 *
 *  ПОДСКАЗКА
 *  Сначала разбейте на токены с учётом кавычек:
 *    for (const match of input.matchAll(/"([^"]*)"|(\S+)/g)) ...
 *  Затем для некавычных токенов используйте regex с именованными
 *  группами (?<key>...) и (?<value>...).
 *
 *  ЛОВУШКА
 *  Невалидный priority:urgent не должен молча превращаться в приоритет.
 *  Считайте его обычным текстом.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {Object} ParsedQuery
 * @property {string[]} tags
 * @property {'low'|'medium'|'high'|null} priority
 * @property {'todo'|'in-progress'|'done'|null} status
 * @property {'todo'|'in-progress'|'done'|null} excludeStatus
 * @property {string} text
 * @property {string|null} dueBefore
 */

/**
 * @param {string} input
 * @returns {ParsedQuery}
 */
export function parseQuery(input) {
  throw new Error('TODO 10.1: not implemented');
}
