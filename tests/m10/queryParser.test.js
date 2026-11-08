import { describe, expect, it } from 'vitest';
import { parseQuery } from '../../src/features/search/queryParser.js';

describe('parseQuery', () => {
  it('returns defaults for an empty query', () => {
    expect(parseQuery('')).toEqual({
      tags: [],
      priority: null,
      status: null,
      excludeStatus: null,
      text: '',
      dueBefore: null,
    });
  });

  it('parses tags in lowercase and removes duplicates', () => {
    expect(parseQuery('tag:Work tag:work tag:home').tags).toEqual(['work', 'home']);
  });

  it('parses a valid priority', () => {
    expect(parseQuery('priority:high').priority).toBe('high');
  });

  it('treats an invalid priority as text', () => {
    const parsed = parseQuery('priority:urgent');
    expect(parsed.priority).toBeNull();
    expect(parsed.text).toBe('priority:urgent');
  });

  it('parses status and excludeStatus', () => {
    const parsed = parseQuery('status:in-progress !done');
    expect(parsed.status).toBe('in-progress');
    expect(parsed.excludeStatus).toBe('done');
    expect(parsed.text).toBe('');
  });

  it('parses due:<date and due:date', () => {
    expect(parseQuery('due:<2026-12-01').dueBefore).toBe('2026-12-01');
    expect(parseQuery('due:2026-12-01').dueBefore).toBe('2026-12-01');
  });

  it('treats an invalid due date as text', () => {
    const parsed = parseQuery('due:<tomorrow');
    expect(parsed.dueBefore).toBeNull();
    expect(parsed.text).toBe('due:<tomorrow');
  });

  it('rejects impossible calendar dates', () => {
    const parsed = parseQuery('due:<2026-02-30');
    expect(parsed.dueBefore).toBeNull();
    expect(parsed.text).toBe('due:<2026-02-30');
  });

  it('keeps quoted phrases as text', () => {
    expect(parseQuery('"buy milk"').text).toBe('buy milk');
    expect(parseQuery('"buy milk" "and bread"').text).toBe('buy milk and bread');
  });

  it('joins bare words into text', () => {
    expect(parseQuery('some   free words').text).toBe('some free words');
  });

  it('parses the full example', () => {
    expect(parseQuery('tag:work priority:high !done "buy milk" due:<2026-12-01')).toEqual({
      tags: ['work'],
      priority: 'high',
      status: null,
      excludeStatus: 'done',
      text: 'buy milk',
      dueBefore: '2026-12-01',
    });
  });

  it('mixes filters and text', () => {
    const parsed = parseQuery('tag:work milk priority:low');
    expect(parsed.tags).toEqual(['work']);
    expect(parsed.priority).toBe('low');
    expect(parsed.text).toBe('milk');
  });

  it('ignores an empty quoted phrase', () => {
    expect(parseQuery('"" tag:work').text).toBe('');
    expect(parseQuery('"" tag:work').tags).toEqual(['work']);
  });

  it('does not throw for non-string input', () => {
    expect(() => parseQuery(null)).not.toThrow();
    expect(parseQuery(null).text).toBe('');
  });
});
