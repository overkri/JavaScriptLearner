import { describe, expect, it } from 'vitest';
import { isNonEmptyString, validateDueDate, validateTitle } from '../../src/utils/validators.js';

describe('isNonEmptyString', () => {
  it('accepts strings with visible characters', () => {
    expect(isNonEmptyString('0')).toBe(true);
    expect(isNonEmptyString(' task ')).toBe(true);
  });

  it('rejects non-strings and blank strings', () => {
    expect(isNonEmptyString(0)).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
    expect(isNonEmptyString('')).toBe(false);
    expect(isNonEmptyString('   ')).toBe(false);
  });
});

describe('validateTitle', () => {
  it('accepts a normal title', () => {
    expect(validateTitle('Купить молоко')).toEqual({ ok: true });
  });

  it('rejects blank and non-string titles', () => {
    expect(validateTitle('   ').ok).toBe(false);
    expect(validateTitle(null).ok).toBe(false);
    expect(typeof validateTitle(null).error).toBe('string');
  });

  it('rejects titles longer than 80 characters', () => {
    expect(validateTitle('x'.repeat(81)).ok).toBe(false);
    expect(validateTitle('x'.repeat(80)).ok).toBe(true);
  });
});

describe('validateDueDate', () => {
  it('accepts an absent due date', () => {
    expect(validateDueDate(null).ok).toBe(true);
    expect(validateDueDate('').ok).toBe(true);
  });

  it('accepts a real calendar date', () => {
    expect(validateDueDate('2026-11-08').ok).toBe(true);
    expect(validateDueDate('2028-02-29').ok).toBe(true);
  });

  it('rejects wrong formats and impossible dates', () => {
    expect(validateDueDate('08.11.2026').ok).toBe(false);
    expect(validateDueDate('2026-02-30').ok).toBe(false);
    expect(validateDueDate('2026-13-01').ok).toBe(false);
  });
});
