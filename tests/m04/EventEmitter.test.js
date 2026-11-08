import { describe, expect, it, vi } from 'vitest';
import { EventEmitter } from '../../src/core/EventEmitter.js';

describe('EventEmitter', () => {
  it('subscribes and emits arguments', () => {
    const emitter = new EventEmitter();
    const handler = vi.fn();
    emitter.on('save', handler);
    expect(emitter.emit('save', 1, 'two')).toBe(true);
    expect(handler).toHaveBeenCalledWith(1, 'two');
  });

  it('returns false when there are no listeners', () => {
    expect(new EventEmitter().emit('nothing')).toBe(false);
  });

  it('returns an unsubscribe function from on()', () => {
    const emitter = new EventEmitter();
    const handler = vi.fn();
    const unsubscribe = emitter.on('save', handler);
    unsubscribe();
    emitter.emit('save');
    expect(handler).not.toHaveBeenCalled();
  });

  it('off removes one handler or all handlers of an event', () => {
    const emitter = new EventEmitter();
    const first = vi.fn();
    const second = vi.fn();
    emitter.on('save', first);
    emitter.on('save', second);
    emitter.off('save', first);
    emitter.emit('save');
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);

    emitter.off('save');
    emitter.emit('save');
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('once fires only once', () => {
    const emitter = new EventEmitter();
    const handler = vi.fn();
    emitter.once('ready', handler);
    emitter.emit('ready', 1);
    emitter.emit('ready', 2);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(1);
  });

  it('keeps events isolated', () => {
    const emitter = new EventEmitter();
    const change = vi.fn();
    const save = vi.fn();
    emitter.on('change', change);
    emitter.on('save', save);
    emitter.emit('change', 'payload');
    expect(change).toHaveBeenCalledWith('payload');
    expect(save).not.toHaveBeenCalled();
  });

  it('a failing handler does not prevent the others (and logs the error)', () => {
    const emitter = new EventEmitter();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const second = vi.fn();
    emitter.on('event', () => {
      throw new Error('boom');
    });
    emitter.on('event', second);
    expect(() => emitter.emit('event')).not.toThrow();
    expect(second).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalled();
  });

  it('supports unsubscribing during emit', () => {
    const emitter = new EventEmitter();
    const second = vi.fn();
    const first = vi.fn(() => emitter.off('event', second));
    emitter.on('event', first);
    emitter.on('event', second);

    emitter.emit('event');
    expect(second).toHaveBeenCalledTimes(1);

    emitter.emit('event');
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('hides listeners in a private field', () => {
    const emitter = new EventEmitter();
    expect(Object.getOwnPropertyNames(emitter)).not.toContain('listeners');
    expect(Object.keys(emitter)).toEqual([]);
  });
});
