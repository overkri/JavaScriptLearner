/**
 * Эталон модуля 12.3 — render.
 */

import { beginComponent, beginRender, configureHooks, endComponent } from './hooks.js';

/**
 * @typedef {import('./createElement.js').VNode} VNode
 */

/** @type {HTMLElement|null} */
let rootContainer = null;
/** @type {VNode|null} */
let rootVNode = null;

configureHooks({ rerender: rerenderRoot });

/**
 * @param {HTMLElement} element
 * @param {Record<string, any>} props
 */
function applyProps(element, props) {
  for (const [key, value] of Object.entries(props ?? {})) {
    if (key === 'children' || key === 'key' || key === 'ref') continue;
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
}

/**
 * @param {VNode|string|number|Array<any>|null|undefined|boolean} vnode
 * @returns {Node|null}
 */
function createNode(vnode) {
  if (vnode === null || vnode === undefined || typeof vnode === 'boolean') return null;
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  if (Array.isArray(vnode)) {
    const fragment = document.createDocumentFragment();
    for (const child of vnode) {
      const node = createNode(child);
      if (node) fragment.append(node);
    }
    return fragment;
  }

  if (typeof vnode.type === 'function') {
    beginComponent();
    /** @type {any} */
    let output;
    try {
      output = vnode.type({ ...vnode.props, children: vnode.children });
    } finally {
      endComponent();
    }
    return createNode(output);
  }

  const element = document.createElement(vnode.type);
  applyProps(element, vnode.props ?? {});

  for (const child of vnode.children ?? []) {
    const node = createNode(child);
    if (node) element.append(node);
  }

  return element;
}

function renderTree() {
  if (!rootContainer) return;
  beginRender();
  const node = rootVNode ? createNode(rootVNode) : null;
  rootContainer.replaceChildren();
  if (node) rootContainer.append(node);
}

/**
 * @param {VNode|string|number} vnode
 * @param {HTMLElement} container
 * @returns {HTMLElement}
 */
export function render(vnode, container) {
  rootContainer = container;
  rootVNode = /** @type {VNode} */ (vnode);
  renderTree();
  return container;
}

/** Перерисовывает последний корень (вызывается из useState). */
export function rerenderRoot() {
  if (!rootContainer || !rootVNode) return;
  renderTree();
}

/** Сбрасывает сохранённый корень. */
export function resetRenderState() {
  rootContainer = null;
  rootVNode = null;
}
