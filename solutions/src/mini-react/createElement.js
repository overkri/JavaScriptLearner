/**
 * Эталон модуля 12.1 — createElement.
 */

/**
 * @typedef {{ type: string|Function, props: Record<string, any>, children: any[] }} VNode
 */

/**
 * @param {any[]} children
 * @returns {any[]}
 */
function normalize(children) {
  /** @type {any[]} */
  const result = [];
  for (const child of children) {
    if (child === null || child === undefined || child === false || child === true) continue;
    if (Array.isArray(child)) {
      result.push(...normalize(child));
    } else {
      result.push(child);
    }
  }
  return result;
}

/**
 * @param {string|Function} type
 * @param {Record<string, any>|null} [props]
 * @param {...any} children
 * @returns {VNode}
 */
export function h(type, props, ...children) {
  const { children: propChildren, ...rest } = props ?? {};
  const allChildren = normalize(propChildren !== undefined ? [propChildren, ...children] : children);

  return {
    type,
    props: { ...rest, children: allChildren },
    children: allChildren,
  };
}
