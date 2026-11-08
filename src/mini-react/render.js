/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 12 · УПРАЖНЕНИЕ 12.3 — render: vnode → DOM
 * ═══════════════════════════════════════════════════════════
 *  Тема:           рекурсивный рендер, компоненты, события, full rerender
 *  Java-аналогия:  интерпретатор дерева UI; «перерисовать всё» — самый
 *                  простой алгоритм согласования
 *  Тесты:          npx vitest run tests/m12/render.test.js   (jsdom)
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  render(vnode, container) → container.
 *  - строки/числа → текстовые узлы;
 *  - type-строка → document.createElement + атрибуты:
 *      className, htmlFor, dataset, style-объект, value, checked,
 *      boolean true → пустой атрибут, on* → addEventListener;
 *    key/ref/children пропускаются;
 *  - type-функция → вызвать type({ ...props, children }) и отрендерить
 *    результат; вложенные компоненты поддерживаются;
 *  - массив vnode → DocumentFragment;
 *  - полная перерисовка контейнера (replaceChildren);
 *  - rerenderRoot() перерисовывает последний root (для setState);
 *  - resetRenderState() — для тестов.
 *
 *  ВАЖНО
 *  Перед обходом дерева вызывайте beginRender(), а вокруг вызова
 *  компонента — beginComponent()/endComponent() из hooks.js.
 *  Это обеспечивает правильные слоты useState/useEffect.
 *
 *  ПОДСКАЗКА
 *  Префикс on: key.slice(2).toLowerCase().
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {import('./createElement.js').VNode} VNode
 */

/**
 * @param {VNode|string|number} vnode
 * @param {HTMLElement} container
 * @returns {HTMLElement}
 */
export function render(vnode, container) {
  throw new Error('TODO 12.3.1: not implemented');
}

/** Перерисовывает последний корень (вызывается из useState). */
export function rerenderRoot() {
  throw new Error('TODO 12.3.2: not implemented');
}

/** Сбрасывает сохранённый корень. */
export function resetRenderState() {
  throw new Error('TODO 12.3.3: not implemented');
}
