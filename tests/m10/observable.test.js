import { describe, expect, it, vi } from 'vitest';
import { observable } from '../../src/features/observable.js';

describe('observable', () => {
  it('notifies about nested property changes with a path', () => {
    const onChange = vi.fn();
    const state = observable({ nested: { x: 1 } }, onChange);

    state.nested.x = 2;

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      type: 'set',
      path: ['nested', 'x'],
      value: 2,
      oldValue: 1,
    });
    expect(state.nested.x).toBe(2);
  });

  it('does not notify when the value is unchanged', () => {
    const onChange = vi.fn();
    const state = observable({ value: 1 }, onChange);
    state.value = 1;
    expect(onChange).not.toHaveBeenCalled();
  });

  it('tracks array mutations', () => {
    const onChange = vi.fn();
    const state = observable({ items: [] }, onChange);

    state.items.push('a');

    const changes = onChange.mock.calls.map(([change]) => change);
    expect(changes.some((change) => change.path.join('.') === 'items.0')).toBe(true);
    expect(state.items).toEqual(['a']);
  });

  it('notifies about deleteProperty', () => {
    const onChange = vi.fn();
    const state = observable({ nested: { x: 1 } }, onChange);
    delete state.nested.x;
    expect(onChange).toHaveBeenCalledWith({
      type: 'delete',
      path: ['nested', 'x'],
      value: undefined,
      oldValue: 1,
    });
    expect('x' in state.nested).toBe(false);
  });

  it('returns the same proxy for the same nested object', () => {
    const state = observable({ nested: { x: 1 } });
    expect(state.nested).toBe(state.nested);
  });

  it('keeps primitives untouched', () => {
    const state = observable({ name: 'TaskFlow' });
    expect(state.name).toBe('TaskFlow');
  });
});
