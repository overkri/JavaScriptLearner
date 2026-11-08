/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 6 · УПРАЖНЕНИЕ 6.1 — Хелпер h() для DOM
 * ═══════════════════════════════════════════════════════════
 *  Тема:           createElement, text nodes, dataset, события
 *  Java-аналогия:  программное построение UI вместо FXML
 *  Тесты:          npx vitest run tests/m06/dom.test.js   (jsdom)
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  Реализуйте:
 *  1. h(tag, props, ...children) — создаёт элемент:
 *     - className → class;
 *     - dataset → data-* атрибуты;
 *     - on* (onClick, onInput...) → addEventListener;
 *     - style-объект → CSS-свойства;
 *     - boolean true → пустой атрибут, false/null/undefined → пропуск;
 *     - children: строки/числа → текстовые узлы, Node → как есть,
 *       вложенные массивы разворачиваются;
 *     - НИКАКОГО innerHTML.
 *  2. clear(el) — удаляет всех детей.
 *  3. qs(selector, root) / qsa(selector, root) — querySelector и
 *     массив из querySelectorAll.
 *
 *  ПОДСКАЗКА
 *  Для текста: document.createTextNode(String(child)).
 *  Для onClick: key.slice(2).toLowerCase() → 'click'.
 *
 *  ЛОВУШКА
 *  innerHTML с пользовательскими данными = XSS. Только textContent
 *  и createTextNode.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @param {string} tag
 * @param {Record<string, any>|null} [props]
 * @param {...any} children
 * @returns {HTMLElement}
 */
export function h(tag, props = {}, ...children) {
  throw new Error('TODO 6.1.1: not implemented');
}

/** @param {HTMLElement} element */
export function clear(element) {
  throw new Error('TODO 6.1.2: not implemented');
}

/**
 * @param {string} selector
 * @param {ParentNode} [root]
 * @returns {Element|null}
 */
export function qs(selector, root = document) {
  throw new Error('TODO 6.1.3: not implemented');
}

/**
 * @param {string} selector
 * @param {ParentNode} [root]
 * @returns {Element[]}
 */
export function qsa(selector, root = document) {
  throw new Error('TODO 6.1.4: not implemented');
}
