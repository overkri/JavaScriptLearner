import { describe, expect, it } from 'vitest';
import { describeTask, formatTags, formatTitle } from '../../src/utils/format.js';

describe('formatTitle', () => {
  it('trims and collapses whitespace', () => {
    expect(formatTitle('  Купить   молоко  ')).toBe('Купить молоко');
  });

  it('returns an empty string for non-string and blank values', () => {
    expect(formatTitle(null)).toBe('');
    expect(formatTitle(undefined)).toBe('');
    expect(formatTitle(42)).toBe('');
    expect(formatTitle('   ')).toBe('');
  });

  it('keeps a title of exactly 80 characters unchanged', () => {
    const title = 'a'.repeat(80);
    expect(formatTitle(title)).toBe(title);
  });

  it('shortens longer titles to 80 characters including the ellipsis', () => {
    const result = formatTitle('b'.repeat(120));
    expect(result).toHaveLength(80);
    expect(result.endsWith('…')).toBe(true);
  });
});

describe('formatTags', () => {
  it('prefixes every tag with #', () => {
    expect(formatTags(['work', 'home'])).toBe('#work #home');
  });

  it('ignores empty tags and non-arrays', () => {
    expect(formatTags(['', '  ', 'work'])).toBe('#work');
    expect(formatTags(null)).toBe('');
    expect(formatTags('work')).toBe('');
  });
});

describe('describeTask', () => {
  it('includes title, priority, tags and due date', () => {
    const text = describeTask({
      title: 'Купить молоко',
      priority: 'high',
      tags: ['home', 'shopping'],
      dueDate: '2026-12-01',
    });
    expect(text).toContain('Купить молоко');
    expect(text).toContain('high');
    expect(text).toContain('#home');
    expect(text).toContain('#shopping');
    expect(text).toContain('2026-12-01');
  });

  it('does not throw for null or undefined', () => {
    expect(() => describeTask(null)).not.toThrow();
    expect(describeTask(undefined)).toContain('medium');
  });
});
