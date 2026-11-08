/**
 * Эталон модуля 6.4 — модальное окно.
 */

import { h } from './dom.js';

let modalCounter = 0;

/**
 * @param {{ title?: string, content?: Node|string|null, closeOnBackdrop?: boolean }} options
 * @returns {{ close: () => void, closed: Promise<void> }}
 */
export function openModal({ title = '', content = null, closeOnBackdrop = true } = {}) {
  const previouslyFocused =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const titleId = `modal-title-${++modalCounter}`;

  const contentElement = h('div', { className: 'modal__content' });
  if (content instanceof Node) {
    contentElement.append(content);
  } else if (content !== null && content !== undefined) {
    contentElement.textContent = String(content);
  }

  const closeButton = h(
    'button',
    {
      type: 'button',
      className: 'icon-button',
      'aria-label': 'Закрыть',
      dataset: { action: 'close' },
    },
    '✕',
  );

  const dialog = h(
    'div',
    {
      className: 'modal',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': titleId,
      tabindex: '-1',
    },
    h(
      'header',
      { className: 'modal__header' },
      h('h2', { className: 'modal__title', id: titleId }, title),
      closeButton,
    ),
    contentElement,
  );

  const backdrop = h('div', { className: 'modal-backdrop' }, dialog);
  document.body.append(backdrop);

  /** @type {() => void} */
  let resolveClosed = () => {};
  /** @type {Promise<void>} */
  const closed = new Promise((resolve) => {
    resolveClosed = () => resolve();
  });

  let isClosed = false;

  const close = () => {
    if (isClosed) return;
    isClosed = true;
    document.removeEventListener('keydown', onKeyDown);
    backdrop.remove();
    resolveClosed();
    if (previouslyFocused?.isConnected) previouslyFocused.focus();
  };

  /**
   * @param {KeyboardEvent} event
   */
  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = [...dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )].filter((element) => !/** @type {HTMLButtonElement} */ (element).disabled);

    if (focusable.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const first = /** @type {HTMLElement} */ (focusable[0]);
    const last = /** @type {HTMLElement} */ (focusable[focusable.length - 1]);
    const active = document.activeElement;

    if (!dialog.contains(active)) {
      event.preventDefault();
      first.focus();
      return;
    }

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  closeButton.addEventListener('click', close);
  backdrop.addEventListener('click', (event) => {
    if (closeOnBackdrop && event.target === backdrop) close();
  });
  document.addEventListener('keydown', onKeyDown);

  closeButton.focus();

  return { close, closed };
}
