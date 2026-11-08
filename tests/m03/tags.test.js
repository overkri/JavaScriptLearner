import { describe, expect, it } from 'vitest';
import { collectTags, renameTag, tagFrequency } from '../../src/domain/tags.js';

/** @param {string} id @param {string[]} tags */
function task(id, tags) {
  return {
    id,
    title: id,
    description: '',
    status: 'todo',
    priority: 'medium',
    tags,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    dueDate: null,
  };
}

const tasks = [
  task('t1', ['work', 'js']),
  task('t2', ['work', 'HOME']),
  task('t3', ['js', 'work']),
  task('t4', []),
];

describe('collectTags', () => {
  it('returns unique lowercase tags as a Set', () => {
    const tags = collectTags(tasks);
    expect(tags).toBeInstanceOf(Set);
    expect([...tags].sort()).toEqual(['home', 'js', 'work']);
  });

  it('handles an empty list', () => {
    expect(collectTags([]).size).toBe(0);
  });
});

describe('tagFrequency', () => {
  it('counts tag occurrences', () => {
    const frequency = tagFrequency(tasks);
    expect(frequency).toBeInstanceOf(Map);
    expect(frequency.get('work')).toBe(3);
    expect(frequency.get('js')).toBe(2);
    expect(frequency.get('home')).toBe(1);
    expect(frequency.get('unknown')).toBeUndefined();
  });
});

describe('renameTag', () => {
  it('renames a tag without mutating the input', () => {
    const result = renameTag(tasks, 'work', 'office');
    expect(result[0].tags).toEqual(['office', 'js']);
    expect(result[1].tags).toEqual(['office', 'home']);
    expect(result[2].tags).toEqual(['js', 'office']);
    expect(result[3]).toBe(tasks[3]);
    expect(tasks[0].tags).toEqual(['work', 'js']);
    expect(result).not.toBe(tasks);
  });

  it('does not create duplicates when the target tag already exists', () => {
    const input = [task('a', ['work', 'home'])];
    expect(renameTag(input, 'work', 'HOME')[0].tags).toEqual(['home']);
  });

  it('removes the tag when the target is empty', () => {
    expect(renameTag(tasks, 'work', '')[0].tags).toEqual(['js']);
  });

  it('returns the original array when the tag is absent', () => {
    expect(renameTag(tasks, 'missing', 'x')).toBe(tasks);
  });

  it('works with frozen tasks', () => {
    const frozen = Object.freeze(tasks.map((item) => Object.freeze({ ...item })));
    expect(() => renameTag(frozen, 'work', 'job')).not.toThrow();
  });
});
