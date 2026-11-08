// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { h } from '../../src/mini-react/createElement.js';
import { resetHooks } from '../../src/mini-react/hooks.js';
import { render, rerenderRoot, resetRenderState } from '../../src/mini-react/render.js';

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

describe('render', () => {
  it('renders elements, attributes and text', () => {
    render(
      h(
        'div',
        { className: 'app', dataset: { role: 'root' }, style: { display: 'flex' } },
        h('h1', {}, 'Title'),
        h('p', {}, 'Text'),
      ),
      container,
    );

    const root = container.querySelector('.app');
    expect(root).not.toBeNull();
    expect(root.dataset.role).toBe('root');
    expect(root.style.display).toBe('flex');
    expect(container.querySelector('h1').textContent).toBe('Title');
    expect(container.querySelector('p').textContent).toBe('Text');
  });

  it('sets boolean and value attributes', () => {
    render(
      h(
        'form',
        {},
        h('input', { id: 'text', value: 'hello', disabled: true }),
        h('input', { id: 'check', type: 'checkbox', checked: true }),
      ),
      container,
    );
    expect(container.querySelector('#text').value).toBe('hello');
    expect(container.querySelector('#text').disabled).toBe(true);
    expect(container.querySelector('#check').checked).toBe(true);
  });

  it('attaches event handlers', () => {
    const onClick = vi.fn();
    render(h('button', { onClick }, 'Click'), container);
    container.querySelector('button').click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders function components with props and children', () => {
    /** @param {{ title: string, children: any[] }} props */
    function Card({ title, children }) {
      return h('section', { className: 'card' }, h('h2', {}, title), children);
    }

    render(h(Card, { title: 'Hello' }, h('span', {}, 'Body')), container);
    expect(container.querySelector('.card h2').textContent).toBe('Hello');
    expect(container.querySelector('.card span').textContent).toBe('Body');
  });

  it('supports nested components', () => {
    const Inner = () => h('em', {}, 'inner');
    const Outer = () => h('div', {}, h(Inner));
    render(h(Outer), container);
    expect(container.querySelector('em').textContent).toBe('inner');
  });

  it('renders arrays into a fragment', () => {
    render(h('ul', {}, [h('li', {}, 'a'), h('li', {}, 'b')]), container);
    expect(container.querySelectorAll('li')).toHaveLength(2);
  });

  it('skips key and ref props', () => {
    render(h('div', { key: 'x', ref: 'y', id: 'z' }), container);
    const div = container.querySelector('div');
    expect(div.hasAttribute('key')).toBe(false);
    expect(div.hasAttribute('ref')).toBe(false);
    expect(div.id).toBe('z');
  });

  it('replaces the container content', () => {
    container.append(document.createElement('span'));
    render(h('p', {}, 'new'), container);
    expect(container.querySelector('span')).toBeNull();
    expect(container.querySelector('p').textContent).toBe('new');
  });

  it('returns the container', () => {
    expect(render(h('div'), container)).toBe(container);
  });

  it('re-renders the root with rerenderRoot', () => {
    const Component = vi.fn(() => h('div', {}, 'x'));
    render(h(Component), container);
    expect(Component).toHaveBeenCalledTimes(1);
    rerenderRoot();
    expect(Component).toHaveBeenCalledTimes(2);
    expect(container.querySelectorAll('div')).toHaveLength(1);
  });
});
