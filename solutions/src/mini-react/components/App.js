/**
 * Модуль 12.5 — корневой компонент мини-React версии.
 */

import { groupByStatus } from '../../domain/taskOps.js';
import { selectStats, selectVisibleTasks } from '../../state/selectors.js';
import { h } from '../createElement.js';
import { useStore } from '../useStore.js';
import { Board } from './Board.js';
import { SearchBar } from './SearchBar.js';

/**
 * @param {{ store: { getState: () => any, subscribe: (listener: () => void) => () => void, dispatch: (action: any) => any } }} props
 */
export function App({ store }) {
  const state = useStore(store);
  const visible = selectVisibleTasks(state);
  const stats = selectStats(state);

  return h(
    'div',
    { className: 'mini-app' },
    h(
      'header',
      { className: 'app-header' },
      h(
        'div',
        { className: 'brand' },
        h('span', { className: 'brand__logo' }, '▦'),
        h('div', {}, h('h1', { className: 'brand__title' }, 'TaskFlow mini-React')),
      ),
      h(SearchBar, {
        value: state.filter?.text ?? '',
        onChange: (text) => store.dispatch({ type: 'FILTER_CHANGED', filter: { text } }),
      }),
    ),
    h(
      'p',
      { className: 'app-status' },
      `Показано: ${visible.length} из ${stats.total} · просрочено: ${stats.overdue}`,
    ),
    h(Board, { tasksByStatus: groupByStatus(visible) }),
  );
}
