/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 12 · УПРАЖНЕНИЕ 12.5e — Корневой компонент App
 * ═══════════════════════════════════════════════════════════
 *  Тема:           useStore, производные данные, композиция
 *  Тесты:          npx vitest run tests/m12/components.test.js   (jsdom)
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  App({ store }) → vnode:
 *  - подписка через useStore(store);
 *  - selectVisibleTasks + selectStats;
 *  - SearchBar, который dispatch'ит FILTER_CHANGED { filter: { text } };
 *  - Board с groupByStatus(visible);
 *  - строка статуса «Показано: X из Y · просрочено: Z».
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @param {{ store: { getState: () => any, subscribe: (listener: () => void) => () => void, dispatch: (action: any) => any } }} props
 * @returns {import('../createElement.js').VNode}
 */
export function App({ store }) {
  throw new Error('TODO 12.5e: not implemented');
}
