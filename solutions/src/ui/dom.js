/**
 * Эталон модуля 6.1 — DOM-хелперы.
 */

/**
 * @param {HTMLElement} element
 * @param {any[]} children
 */
function appendChildren(element, children) {
  for (const child of children) {
    if (child === null || child === undefined || child === false || child === true) continue;
    if (Array.isArray(child)) {
      appendChildren(element, child);
    } else if (child instanceof Node) {
      element.append(child);
    } else {
      element.append(document.createTextNode(String(child)));
    }
  }
}

/**
 * @param {string} tag
 * @param {Record<string, any>|null} [props]
 * @param {...any} children
 * @returns {HTMLElement}
 */
export function h(tag, props = {}, ...children) {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(props ?? {})) {
    if (value === null || value === undefined || value === false) continue;

    if (key === 'className') {
      element.className = String(value);
    } else if (key === 'dataset') {
      for (const [dataKey, dataValue] of Object.entries(value)) {
        element.dataset[dataKey] = String(dataValue);
      }
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'htmlFor') {
      /** @type {any} */ (element).htmlFor = String(value);
    } else if (key === 'value' && 'value' in element) {
      /** @type {any} */ (element).value = value;
    } else if (key === 'checked' || key === 'disabled' || key === 'selected') {
      /** @type {any} */ (element)[key] = Boolean(value);
    } else if (value === true) {
      element.setAttribute(key, '');
    } else {
      element.setAttribute(key, String(value));
    }
  }

  appendChildren(element, children);
  return element;
}

/** @param {HTMLElement} element */
export function clear(element) {
  while (element.firstChild) {
    element.firstChild.remove();
  }
}

/**
 * @param {string} selector
 * @param {ParentNode} [root]
 * @returns {Element|null}
 */
export function qs(selector, root = document) {
  return root.querySelector(selector);
}

/**
 * @param {string} selector
 * @param {ParentNode} [root]
 * @returns {Element[]}
 */
export function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}
