import { describe, expect, it } from 'vitest';
import { createIdGenerator, uid } from '../../src/utils/id.js';

describe('createIdGenerator', () => {
  it('returns sequential ids with the default prefix', () => {
    const nextId = createIdGenerator();
    expect(nextId()).toBe('task-1');
    expect(nextId()).toBe('task-2');
    expect(nextId()).toBe('task-3');
  });

  it('uses a custom prefix', () => {
    const nextId = createIdGenerator('note');
    expect(nextId()).toBe('note-1');
    expect(nextId()).toBe('note-2');
  });

  it('keeps counters of different generators independent', () => {
    const first = createIdGenerator('a');
    const second = createIdGenerator('b');
    expect(first()).toBe('a-1');
    expect(second()).toBe('b-1');
    expect(first()).toBe('a-2');
    expect(second()).toBe('b-2');
  });

  it('does not expose the counter', () => {
    const nextId = createIdGenerator();
    expect(Object.keys(nextId)).toEqual([]);
    expect(nextId.counter).toBeUndefined();
  });
});

describe('uid', () => {
  it('returns a UUID v4 string', () => {
    expect(uid()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('returns different values', () => {
    expect(uid()).not.toBe(uid());
  });
});
