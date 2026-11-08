/**
 * Эталон модуля 6.6 — очередь toast-уведомлений.
 */

/**
 * @typedef {{ message: string, type: string, timeout: number }} ToastItem
 */

/** @type {ToastItem[]} */
const queue = [];
/** @type {HTMLElement|null} */
let active = null;
/** @type {ToastItem|null} */
let activeItem = null;
/** @type {ReturnType<typeof setTimeout>|null} */
let timer = null;

/** @returns {HTMLElement} */
function getRoot() {
  let root = document.getElementById('toast-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'toast-root';
    root.className = 'toast-container';
    root.setAttribute('aria-live', 'polite');
    document.body.append(root);
  }
  return root;
}

function showNext() {
  if (active || queue.length === 0) return;

  const item = queue.shift();
  if (!item) return;

  const element = document.createElement('div');
  element.className = `toast toast--${item.type}`;
  element.setAttribute('role', 'status');
  element.textContent = item.message;

  getRoot().append(element);
  active = element;
  activeItem = item;

  timer = setTimeout(() => {
    dismissActive();
  }, item.timeout);
}

function dismissActive() {
  if (!active) return;
  if (timer !== null) clearTimeout(timer);
  timer = null;

  active.remove();
  active = null;
  activeItem = null;
  showNext();
}

/**
 * @param {string} message
 * @param {{ type?: 'info'|'success'|'error'|'warning', timeout?: number }} [options]
 * @returns {() => void} dismiss
 */
export function showToast(message, { type = 'info', timeout = 3000 } = {}) {
  const item = { message: String(message), type, timeout };
  queue.push(item);
  showNext();

  return () => {
    const index = queue.indexOf(item);
    if (index !== -1) {
      queue.splice(index, 1);
      return;
    }
    if (activeItem === item) dismissActive();
  };
}

/** Убирает все уведомления и очередь. */
export function clearToasts() {
  queue.length = 0;
  if (timer !== null) clearTimeout(timer);
  timer = null;
  if (active) active.remove();
  active = null;
  activeItem = null;
}
