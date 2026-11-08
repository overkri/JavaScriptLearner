import { describe, expect, it } from 'vitest';
import { formatDate, formatRelative, pluralizeTasks } from '../../src/utils/intl.js';

describe('formatDate', () => {
  it('formats an ISO date in Russian', () => {
    const formatted = formatDate('2026-12-01');
    expect(formatted).toContain('1');
    expect(formatted).toContain('декабря');
    expect(formatted).toContain('2026');
  });

  it('supports another locale', () => {
    expect(formatDate('2026-12-01', 'en-US')).toContain('December');
  });

  it('returns an empty string for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('');
    expect(formatDate('2026-02-30')).not.toBe(undefined);
  });
});

describe('formatRelative', () => {
  const now = new Date(2026, 10, 8, 12, 0, 0);

  it('formats future dates', () => {
    expect(formatRelative('2026-11-11', now)).toBe('через 3 дня');
  });

  it('formats yesterday', () => {
    expect(formatRelative('2026-11-07', now)).toBe('вчера');
  });

  it('formats today', () => {
    expect(formatRelative('2026-11-08', now)).toBe('сегодня');
  });

  it('returns an empty string for an invalid date', () => {
    expect(formatRelative('nope', now)).toBe('');
  });
});

describe('pluralizeTasks', () => {
  it.each([
    [0, '0 задач'],
    [1, '1 задача'],
    [2, '2 задачи'],
    [5, '5 задач'],
    [11, '11 задач'],
    [21, '21 задача'],
    [101, '101 задача'],
  ])('formats %i tasks', (n, expected) => {
    expect(pluralizeTasks(n)).toBe(expected);
  });
});
