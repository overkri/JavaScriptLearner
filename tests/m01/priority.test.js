import { describe, expect, it } from 'vitest';
import { PRIORITY, isPriority, priorityWeight } from '../../src/domain/priority.js';

describe('PRIORITY', () => {
  it('contains exactly three priority values', () => {
    expect(PRIORITY).toEqual({ LOW: 'low', MEDIUM: 'medium', HIGH: 'high' });
  });

  it('is frozen', () => {
    expect(Object.isFrozen(PRIORITY)).toBe(true);
  });
});

describe('priorityWeight', () => {
  it('returns 1, 2 and 3 for low, medium and high', () => {
    expect(priorityWeight(PRIORITY.LOW)).toBe(1);
    expect(priorityWeight(PRIORITY.MEDIUM)).toBe(2);
    expect(priorityWeight(PRIORITY.HIGH)).toBe(3);
  });

  it('returns -1 for an unknown priority', () => {
    expect(priorityWeight('urgent')).toBe(-1);
    expect(priorityWeight('')).toBe(-1);
  });
});

describe('isPriority', () => {
  it('accepts only the three known strings', () => {
    expect(isPriority('low')).toBe(true);
    expect(isPriority('medium')).toBe(true);
    expect(isPriority('high')).toBe(true);
  });

  it('rejects everything else', () => {
    expect(isPriority('LOW')).toBe(false);
    expect(isPriority('urgent')).toBe(false);
    expect(isPriority(null)).toBe(false);
    expect(isPriority(1)).toBe(false);
  });
});
