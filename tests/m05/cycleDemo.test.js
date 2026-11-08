import { describe, expect, it } from 'vitest';
import { a, describeCycle, getA } from '../../src/playground/cycleDemo/a.js';
import { b, describeBack, getB } from '../../src/playground/cycleDemo/b.js';

describe('circular imports', () => {
  it('exposes both sides of the cycle', () => {
    expect(a.name).toBe('a');
    expect(b.name).toBe('b');
    expect(getA()).toBe(a);
    expect(getB()).toBe(b);
  });

  it('resolves values lazily inside functions', () => {
    expect(describeCycle()).toBe('a->b->a');
    expect(describeBack()).toBe('b<-a');
  });
});
