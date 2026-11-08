// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { renderSafe, renderUnsafe } from '../../src/playground/xssDemo.js';

const payload = '<img src=x onerror="window.hacked = true">';

afterEach(() => {
  document.body.replaceChildren();
});

describe('xssDemo', () => {
  it('the unsafe version creates an img element from user input', () => {
    const container = document.createElement('div');
    document.body.append(container);
    renderUnsafe(container, payload);
    expect(container.querySelector('img')).not.toBeNull();
    expect(container.querySelector('.xss').textContent).toBe('');
  });

  it('the safe version keeps the input as text', () => {
    const container = document.createElement('div');
    document.body.append(container);
    renderSafe(container, payload);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('.xss').textContent).toBe(payload);
  });

  it('the safe version replaces previous content', () => {
    const container = document.createElement('div');
    container.append(document.createElement('span'));
    renderSafe(container, 'text');
    expect(container.querySelector('span')).toBeNull();
  });
});
