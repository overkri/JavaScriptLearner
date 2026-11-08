// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { clear, h, qs, qsa } from '../../src/ui/dom.js';

afterEach(() => {
  document.body.replaceChildren();
});

describe('h', () => {
  it('creates an element with class, dataset and attributes', () => {
    const el = h('button', {
      className: 'button primary',
      dataset: { action: 'save', id: '42' },
      type: 'button',
      title: 'Save',
      disabled: false,
    });
    expect(el.tagName).toBe('BUTTON');
    expect(el.className).toBe('button primary');
    expect(el.dataset.action).toBe('save');
    expect(el.dataset.id).toBe('42');
    expect(el.getAttribute('type')).toBe('button');
    expect(el.getAttribute('title')).toBe('Save');
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('creates nested children, text nodes and flattens arrays', () => {
    const el = h(
      'div',
      {},
      h('h1', {}, 'Title'),
      ['one', h('span', {}, 'two'), [3]],
      null,
      false,
    );
    expect(el.querySelector('h1').textContent).toBe('Title');
    expect(el.textContent).toBe('Titleonetwo3');
    expect(el.querySelectorAll('span')).toHaveLength(1);
    expect(el.children).toHaveLength(2);
  });

  it('treats strings as text, not HTML (no XSS)', () => {
    const payload = '<img src=x onerror="window.hacked=true">';
    const el = h('p', {}, payload);
    expect(el.querySelector('img')).toBeNull();
    expect(el.textContent).toBe(payload);
  });

  it('attaches events from on* props', () => {
    const onClick = vi.fn();
    const button = h('button', { onClick }, 'Click');
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('sets style object properties', () => {
    const el = h('div', { style: { display: 'none' } });
    expect(el.style.display).toBe('none');
  });
});

describe('clear', () => {
  it('removes all children', () => {
    const el = h('div', {}, h('span', {}, 'a'), h('span', {}, 'b'));
    clear(el);
    expect(el.childNodes).toHaveLength(0);
  });
});

describe('qs and qsa', () => {
  it('finds elements inside a root and returns an array', () => {
    const root = h('div', {}, h('span', { className: 'tag' }, 'a'), h('span', { className: 'tag' }, 'b'));
    expect(qs('.tag', root)?.textContent).toBe('a');
    expect(qsa('.tag', root)).toHaveLength(2);
    expect(Array.isArray(qsa('.tag', root))).toBe(true);
  });
});
