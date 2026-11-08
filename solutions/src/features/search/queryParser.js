/**
 * Эталон модуля 10.1 — парсер запросов.
 */

import { validateDueDate } from '../../utils/validators.js';

const PRIORITIES = new Set(['low', 'medium', 'high']);
const STATUSES = new Set(['todo', 'in-progress', 'done']);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TOKEN_RE = /"([^"]*)"|(\S+)/g;
const KEY_RE = /^(?<key>tag|priority|status|due):(?<value>.*)$/;
const EXCLUDE_RE = /^!(?<status>todo|in-progress|done)$/;

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
  /** @type {ParsedQuery} */
  const result = {
    tags: [],
    priority: null,
    status: null,
    excludeStatus: null,
    text: '',
    dueBefore: null,
  };

  const source = typeof input === 'string' ? input : '';
  /** @type {string[]} */
  const textParts = [];

  for (const match of source.matchAll(TOKEN_RE)) {
    const quoted = match[1];
    const raw = match[2];

    if (quoted !== undefined) {
      if (quoted.trim()) textParts.push(quoted.trim());
      continue;
    }

    const token = raw;
    if (!token) continue;

    const exclude = EXCLUDE_RE.exec(token);
    if (exclude?.groups?.status) {
      result.excludeStatus = /** @type {ParsedQuery['excludeStatus']} */ (
        exclude.groups.status
      );
      continue;
    }

    const keyed = KEY_RE.exec(token);
    if (keyed?.groups) {
      const key = keyed.groups.key;
      const value = keyed.groups.value;
      if (key === 'tag') {
        const tag = value.trim().toLowerCase();
        if (tag && !result.tags.includes(tag)) result.tags.push(tag);
        continue;
      }
      if (key === 'priority' && PRIORITIES.has(value)) {
        result.priority = /** @type {ParsedQuery['priority']} */ (value);
        continue;
      }
      if (key === 'status' && STATUSES.has(value)) {
        result.status = /** @type {ParsedQuery['status']} */ (value);
        continue;
      }
      if (key === 'due') {
        const date = value.replace(/^</, '');
        if (DATE_RE.test(date) && validateDueDate(date).ok) {
          result.dueBefore = date;
          continue;
        }
      }
    }

    textParts.push(token);
  }

  result.text = textParts.join(' ').trim();
  return result;
}
