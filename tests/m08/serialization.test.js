import { describe, expect, it } from 'vitest';
import {
  deserializeTasks,
  serializeTasks,
} from '../../src/storage/serialization.js';

describe('serializeTasks / deserializeTasks', () => {
  it('round-trips a plain task array', () => {
    const tasks = [
      {
        id: 't1',
        title: 'Task',
        tags: ['work', 'home'],
        dueDate: '2026-12-01',
      },
    ];
    expect(deserializeTasks(serializeTasks(tasks))).toEqual(tasks);
  });

  it('restores Date instances', () => {
    const input = { when: new Date('2026-11-08T10:20:30.000Z') };
    const output = deserializeTasks(serializeTasks(input));
    expect(output.when).toBeInstanceOf(Date);
    expect(output.when.toISOString()).toBe('2026-11-08T10:20:30.000Z');
  });

  it('restores Set and Map', () => {
    const input = {
      tags: new Set(['work', 'home']),
      owners: new Map([['ada', { id: 1 }]]),
    };
    const output = deserializeTasks(serializeTasks(input));
    expect(output.tags).toBeInstanceOf(Set);
    expect([...output.tags]).toEqual(['work', 'home']);
    expect(output.owners).toBeInstanceOf(Map);
    expect(output.owners.get('ada')).toEqual({ id: 1 });
  });

  it('restores nested Date inside a Set', () => {
    const date = new Date('2026-01-01T00:00:00.000Z');
    const output = deserializeTasks(serializeTasks({ dates: new Set([date]) }));
    const [restored] = [...output.dates];
    expect(restored).toBeInstanceOf(Date);
    expect(restored.toISOString()).toBe(date.toISOString());
  });

  it('drops undefined properties, as JSON does', () => {
    const output = deserializeTasks(serializeTasks({ a: undefined, b: 1 }));
    expect(output).toEqual({ b: 1 });
  });

  it('throws a clear error for circular references', () => {
    const data = { id: 't1' };
    data.self = data;
    expect(() => serializeTasks(data)).toThrow(/circular/i);
  });

  it('keeps the original TypeError as cause', () => {
    const data = {};
    data.self = data;
    try {
      serializeTasks(data);
    } catch (error) {
      expect(error.cause).toBeInstanceOf(TypeError);
    }
  });

  it('throws SyntaxError for invalid JSON', () => {
    expect(() => deserializeTasks('{oops')).toThrow(SyntaxError);
  });
});
