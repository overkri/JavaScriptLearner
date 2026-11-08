// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { openModal } from '../../src/ui/Modal.js';
import { h } from '../../src/ui/dom.js';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('openModal', () => {
  it('renders an accessible dialog with title and content', () => {
    const modal = openModal({ title: 'Задача', content: 'Текст' });
    const dialog = document.querySelector('.modal');
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    const title = document.getElementById(dialog.getAttribute('aria-labelledby'));
    expect(title.textContent).toBe('Задача');
    expect(dialog.querySelector('.modal__content').textContent).toBe('Текст');
    expect(typeof modal.close).toBe('function');
    modal.close();
  });

  it('inserts a Node as content', () => {
    const form = h('form', { id: 'test-form' });
    const modal = openModal({ title: 'Form', content: form });
    expect(document.querySelector('.modal__content form')).toBe(form);
    modal.close();
  });

  it('closes by the close button and resolves closed', async () => {
    const modal = openModal({ title: 'T', content: 'C' });
    document.querySelector('[data-action="close"]').click();
    await modal.closed;
    expect(document.querySelector('.modal-backdrop')).toBeNull();
  });

  it('closes on Escape', async () => {
    const modal = openModal({ title: 'T' });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await modal.closed;
    expect(document.querySelector('.modal-backdrop')).toBeNull();
  });

  it('closes on backdrop click but not inside the dialog', async () => {
    const modal = openModal({ title: 'T' });
    document.querySelector('.modal').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.querySelector('.modal-backdrop')).not.toBeNull();

    document.querySelector('.modal-backdrop').dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    await modal.closed;
    expect(document.querySelector('.modal-backdrop')).toBeNull();
  });

  it('returns focus to the previously focused element', () => {
    const trigger = h('button', {}, 'Open');
    document.body.append(trigger);
    trigger.focus();

    const modal = openModal({ title: 'Focus' });
    expect(document.activeElement).not.toBe(trigger);
    expect(document.querySelector('.modal').contains(document.activeElement)).toBe(true);

    modal.close();
    expect(document.activeElement).toBe(trigger);
  });

  it('traps Tab inside the dialog', () => {
    const modal = openModal({ title: 'Trap', content: h('button', { id: 'inside' }, 'Inside') });
    const focusable = [...document.querySelectorAll('.modal button')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    last.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(first);

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }),
    );
    expect(document.activeElement).toBe(last);
    modal.close();
  });

  it('is idempotent and resolves closed once', async () => {
    const modal = openModal({ title: 'T' });
    const listener = vi.fn();
    modal.closed.then(listener);
    modal.close();
    modal.close();
    await modal.closed;
    await Promise.resolve();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.modal-backdrop')).toBeNull();
  });
});
