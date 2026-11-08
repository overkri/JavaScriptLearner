// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { h } from '../../src/mini-react/createElement.js';
import {
  resetHooks,
  useEffect,
  useState,
} from '../../src/mini-react/hooks.js';
import { render, resetRenderState } from '../../src/mini-react/render.js';

/** @type {HTMLElement} */
let container;

beforeEach(() => {
  document.body.replaceChildren();
  resetRenderState();
  resetHooks();
  container = document.createElement('div');
  document.body.append(container);
});

afterEach(() => {
  resetRenderState();
  resetHooks();
});

describe('useState', () => {
  it('updates the DOM after setState', () => {
    function Counter() {
      const [count, setCount] = useState(0);
      return h('button', { onClick: () => setCount(count + 1) }, `count:${count}`);
    }

    render(h(Counter), container);
    expect(container.textContent).toBe('count:0');
    container.querySelector('button').click();
    expect(container.textContent).toBe('count:1');
    container.querySelector('button').click();
    expect(container.textContent).toBe('count:2');
  });

  it('supports functional updaters and a lazy initializer', () => {
    const initializer = vi.fn(() => 1);
    function Counter() {
      const [count, setCount] = useState(initializer);
      return h('button', { onClick: () => setCount((value) => value + 10) }, String(count));
    }
    render(h(Counter), container);
    expect(initializer).toHaveBeenCalledTimes(1);
    container.querySelector('button').click();
    expect(container.textContent).toBe('11');
  });

  it('does not re-render when Object.is says the value is the same', () => {
    const renderSpy = vi.fn();
    function Component() {
      renderSpy();
      const [count, setCount] = useState(0);
      return h('button', { onClick: () => setCount(0) }, String(count));
    }
    render(h(Component), container);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    container.querySelector('button').click();
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});

describe('useEffect', () => {
  it('runs on mount and after deps change, cleaning up first', () => {
    const effect = vi.fn();
    const cleanup = vi.fn();

    function Component() {
      const [count, setCount] = useState(0);
      useEffect(() => {
        effect(count);
        return cleanup;
      }, [count]);
      return h('button', { onClick: () => setCount(count + 1) }, String(count));
    }

    render(h(Component), container);
    expect(effect).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenLastCalledWith(0);

    container.querySelector('button').click();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenCalledTimes(2);
    expect(effect).toHaveBeenLastCalledWith(1);

    container.querySelector('button').click();
    expect(cleanup).toHaveBeenCalledTimes(2);
    expect(effect).toHaveBeenCalledTimes(3);
  });

  it('runs once with an empty deps array', () => {
    const effect = vi.fn();
    function Component() {
      const [count, setCount] = useState(0);
      useEffect(effect, []);
      return h('button', { onClick: () => setCount(count + 1) }, String(count));
    }
    render(h(Component), container);
    container.querySelector('button').click();
    container.querySelector('button').click();
    expect(effect).toHaveBeenCalledTimes(1);
  });

  it('runs after every render without deps', () => {
    const effect = vi.fn();
    function Component() {
      const [count, setCount] = useState(0);
      useEffect(effect);
      return h('button', { onClick: () => setCount(count + 1) }, String(count));
    }
    render(h(Component), container);
    container.querySelector('button').click();
    expect(effect).toHaveBeenCalledTimes(2);
  });

  it('resetHooks calls effect cleanups', () => {
    const cleanup = vi.fn();
    function Component() {
      useEffect(() => cleanup, []);
      return h('div');
    }
    render(h(Component), container);
    resetHooks();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
