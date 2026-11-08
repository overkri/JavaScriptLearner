/**
 * ═══════════════════════════════════════════════════════════
 *  ГОТОВАЯ ТОЧКА ВХОДА · Версия приложения на мини-React
 * ═══════════════════════════════════════════════════════════
 *  Запуск: откройте mini-react.html (или подключите этот файл
 *  вместо main.js в index.html).
 *
 *  Это вторая версия UI: тот же store, но рендер через
 *  собственные h()/render()/useState() из src/mini-react.
 *  Сравните с императивной версией из модуля 6 и заполните
 *  docs/12-reflection.md.
 * ═══════════════════════════════════════════════════════════
 */

import './styles.css';
import { fetchTasks } from './api/taskApi.js';
import { h } from './mini-react/createElement.js';
import { App } from './mini-react/components/App.js';
import { render } from './mini-react/render.js';
import { createInitialState, reducer } from './state/reducer.js';
import { createStore } from './state/store.js';

const container = document.getElementById('board');
const status = document.getElementById('app-status');

try {
  const store = createStore(reducer, createInitialState());
  render(h(App, { store }), container);

  fetchTasks()
    .then((tasks) => store.dispatch({ type: 'TASKS_LOADED', tasks }))
    .catch((error) => {
      console.warn('[mini-react] Не удалось загрузить задачи:', error.message);
      if (status) {
        status.hidden = false;
        status.textContent = 'Не удалось загрузить задачи. Проверьте консоль.';
      }
    });
} catch (error) {
  console.warn('[mini-react] Модуль 12 ещё не выполнен:', error.message);
  if (status) {
    status.hidden = false;
    status.textContent = 'Мини-React ещё не готов: выполните модуль 12.';
  }
}
