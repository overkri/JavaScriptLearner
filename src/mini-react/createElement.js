/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 12 · УПРАЖНЕНИЕ 12.1 — createElement (h)
 * ═══════════════════════════════════════════════════════════
 *  Тема:           vnode, нормализация детей, функции-компоненты
 *  Java-аналогия:  AST-узел UI: тип + атрибуты + дети
 *  Тесты:          npx vitest run tests/m12/createElement.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  h(type, props, ...children) → { type, props, children }.
 *  - type: строка ('div') или функция-компонент;
 *  - props: копия без мутации; если был props.children — объединить;
 *  - children: ПЛОСКИЙ массив; вложенные массивы разворачиваются,
 *    null/undefined/false/true отбрасываются, строки/числа остаются;
 *  - в props.children положите тот же нормализованный массив.
 *
 *  ПОДСКАЗКА
 *  Напишите normalize(children): рекурсивно flatMap, затем filter.
 *
 *  ЛОВУШКА
 *  Если не разворачивать массивы, render получит [ [vnode, vnode] ]
 *  и создаст лишний текстовый узел или упадёт.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {{ type: string|Function, props: Record<string, any>, children: any[] }} VNode
 */

/**
 * @param {string|Function} type
 * @param {Record<string, any>|null} [props]
 * @param {...any} children
 * @returns {VNode}
 */
export function h(type, props, ...children) {
  throw new Error('TODO 12.1: not implemented');
}
