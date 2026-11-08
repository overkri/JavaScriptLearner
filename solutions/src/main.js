/**
 * ═══════════════════════════════════════════════════════════
 *  ГОТОВАЯ ТОЧКА ВХОДА · TaskFlow
 * ═══════════════════════════════════════════════════════════
 *  Этот файл студент не пишет: он связывает модули курса.
 *  Пока модуль не выполнен, соответствующая функция бросит
 *  TODO-ошибку — main.js покажет сообщение в #app-status и
 *  оставит статичную доску из index.html.
 *
 *  Порядок инициализации:
 *   cache (модуль 8) → store + history (9) → board (6)
 *   → server (7) → search (10) → DnD (10) → stats (5).
 * ═══════════════════════════════════════════════════════════
 */

import './styles.css';

import { createTask as createTaskApi } from './api/taskApi.js';
import { deleteTask as deleteTaskApi, updateTask as updateTaskApi } from './api/taskApi.js';
import { loadInitialData } from './api/sync.js';
import { computeStats } from './domain/stats.js';
import { createTask } from './domain/task.js';
import { filterTasks, groupByStatus } from './domain/taskOps.js';
import { enableDragAndDrop } from './features/dnd.js';
import { parseQuery } from './features/search/queryParser.js';
import { loadStatsPanel } from './features/stats/index.js';
import { canRedo, canUndo, withHistory } from './state/history.js';
import { createInitialState, reducer } from './state/reducer.js';
import { createStore } from './state/store.js';
import { asyncThunk } from './state/middleware.js';
import { createStorage } from './storage/localStorageAdapter.js';
import { migrate } from './storage/migrations.js';
import { renderBoard } from './ui/Board.js';
import { openModal } from './ui/Modal.js';
import { renderTaskForm } from './ui/TaskForm.js';
import { showToast } from './ui/Toast.js';
import { debounce } from './utils/functional.js';
import { formatTitle } from './utils/format.js';

const boardEl = /** @type {HTMLElement} */ (document.getElementById('board'));
const searchEl = /** @type {HTMLInputElement} */ (document.getElementById('search'));
const statusEl = /** @type {HTMLElement} */ (document.getElementById('app-status'));
const addButton = /** @type {HTMLButtonElement} */ (document.getElementById('btn-add'));
const statsButton = /** @type {HTMLButtonElement} */ (document.getElementById('btn-stats'));
const undoButton = /** @type {HTMLButtonElement} */ (document.getElementById('btn-undo'));
const redoButton = /** @type {HTMLButtonElement} */ (document.getElementById('btn-redo'));
const themeButton = /** @type {HTMLButtonElement} */ (document.getElementById('btn-theme'));

const cache = createStorage('taskflow.v3', { defaultValue: null });
const themeStorage = createStorage('taskflow.theme', { defaultValue: 'system' });

/**
 * @param {string} message
 * @param {boolean} [isError]
 */
function setStatus(message, isError = false) {
  if (!statusEl) return;
  statusEl.hidden = message.length === 0;
  statusEl.textContent = message;
  statusEl.classList.toggle('app-status--error', isError);
}

/**
 * @param {string} message
 * @param {{ type?: 'info'|'success'|'error'|'warning', timeout?: number }} [options]
 */
function notify(message, options) {
  try {
    showToast(message, options);
  } catch {
    setStatus(message, options?.type === 'error');
  }
}

/** @returns {import('./domain/task.js').Task[]} */
function loadCachedTasks() {
  try {
    const raw = cache.load();
    if (!raw) return [];
    return migrate(raw).tasks;
  } catch {
    return [];
  }
}

/** @param {import('./domain/task.js').Task[]} tasks */
function saveTasks(tasks) {
  cache.save({ version: 3, tasks });
}

const historyReducer = withHistory(reducer, { limit: 50 });
const store = createStore(
  historyReducer,
  { past: [], present: createInitialState(), future: [] },
  [asyncThunk],
);

/** @returns {import('./state/reducer.js').State} */
function presentState() {
  return store.getState().present;
}

/**
 * Применяет поисковый запрос (модуль 10) к списку задач.
 * @param {import('./state/reducer.js').State} state
 * @returns {import('./domain/task.js').Task[]}
 */
function visibleTasks(state) {
  const raw = state.filter.text ?? '';
  const parsed = parseQuery(raw);
  const filter = state.filter;

  let tasks = filterTasks(state.tasks, {
    status: parsed.status ?? (filter.status !== 'all' ? filter.status : undefined),
    priority: parsed.priority ?? (filter.priority !== 'all' ? filter.priority : undefined),
    text: parsed.text,
  });

  if (parsed.tags.length > 0) {
    tasks = tasks.filter((task) => parsed.tags.every((tag) => task.tags.includes(tag)));
  }
  if (parsed.excludeStatus) {
    tasks = tasks.filter((task) => task.status !== parsed.excludeStatus);
  }
  if (parsed.dueBefore) {
    tasks = tasks.filter((task) => task.dueDate !== null && task.dueDate < parsed.dueBefore);
  }

  return tasks;
}

function updateHistoryButtons() {
  const state = store.getState();
  if (undoButton) undoButton.disabled = !canUndo(state);
  if (redoButton) redoButton.disabled = !canRedo(state);
}

function renderApp() {
  const state = presentState();
  /** @type {any} */ (window).__tasks = state.tasks;
  renderBoard(boardEl, groupByStatus(visibleTasks(state)), handleBoardAction);
  updateHistoryButtons();
}

/**
 * @param {{ type: string, id: string }} action
 */
function handleBoardAction({ type, id }) {
  const task = presentState().tasks.find((item) => item.id === id);
  if (!task) return;

  if (type === 'edit') {
    openTaskDialog(task);
  } else if (type === 'delete') {
    const confirmed = typeof window.confirm === 'function' ? window.confirm(`Удалить «${task.title}»?`) : true;
    if (confirmed) deleteTaskOptimistic(task);
  }
}

/**
 * @param {import('./domain/task.js').Task|null} [task]
 */
function openTaskDialog(task = null) {
  /** @type {{ close: () => void }} */
  // eslint-disable-next-line prefer-const -- назначается после создания формы
  let modal;

  const form = renderTaskForm({
    task,
    onSubmit: (data) => {
      modal.close();
      void saveTask(task, data);
    },
    onCancel: () => modal.close(),
  });

  modal = openModal({
    title: task ? 'Редактировать задачу' : 'Новая задача',
    content: form,
  });
}

/**
 * @param {import('./domain/task.js').Task|null} task
 * @param {{ title: string, description: string, priority: string, tags: string[], dueDate: string|null }} data
 */
async function saveTask(task, data) {
  const normalized = {
    ...data,
    title: formatTitle(data.title),
    priority: /** @type {import('./domain/task.js').Priority} */ (data.priority),
  };

  if (task) {
    const patch = { ...normalized };
    store.dispatch({ type: 'TASK_UPDATED', id: task.id, patch });
    try {
      await updateTaskApi(task.id, patch);
      notify('Задача сохранена', { type: 'success' });
    } catch (error) {
      store.dispatch({
        type: 'TASK_UPDATED',
        id: task.id,
        patch: {
          title: task.title,
          description: task.description,
          priority: task.priority,
          tags: task.tags,
          dueDate: task.dueDate,
        },
      });
      notify(`Не удалось сохранить задачу: ${/** @type {Error} */ (error).message}`, {
        type: 'error',
      });
    }
    return;
  }

  const optimistic = createTask(normalized);
  store.dispatch({ type: 'TASK_ADDED', task: optimistic });

  try {
    const saved = await createTaskApi(normalized);
    // Заменяем оптимистичную задачу серверной в одном действии:
    // меньше шагов истории и нет мигания пустой колонкой.
    store.dispatch({ type: 'TASK_UPDATED', id: optimistic.id, patch: saved });
    notify('Задача создана', { type: 'success' });
  } catch (error) {
    store.dispatch({ type: 'TASK_REMOVED', id: optimistic.id });
    notify(`Не удалось создать задачу: ${/** @type {Error} */ (error).message}`, {
      type: 'error',
    });
  }
}

/** @param {import('./domain/task.js').Task} task */
async function deleteTaskOptimistic(task) {
  store.dispatch({ type: 'TASK_REMOVED', id: task.id });
  try {
    await deleteTaskApi(task.id);
    notify('Задача удалена', { type: 'success' });
  } catch (error) {
    store.dispatch({ type: 'TASK_ADDED', task });
    notify(`Не удалось удалить задачу: ${/** @type {Error} */ (error).message}`, {
      type: 'error',
    });
  }
}

/**
 * @param {{ id: string, status: string }} move
 */
async function handleMove({ id, status }) {
  const task = presentState().tasks.find((item) => item.id === id);
  if (!task || task.status === status) return;

  const previousStatus = task.status;
  store.dispatch({ type: 'TASK_MOVED', id, status: /** @type {any} */ (status) });

  try {
    await updateTaskApi(id, { status: /** @type {any} */ (status) });
  } catch (error) {
    store.dispatch({ type: 'TASK_MOVED', id, status: previousStatus });
    notify(`Не удалось переместить задачу: ${/** @type {Error} */ (error).message}`, {
      type: 'error',
    });
  }
}

function bindUi() {
  if (addButton) addButton.addEventListener('click', () => openTaskDialog(null));

  if (undoButton) {
    undoButton.addEventListener('click', () => store.dispatch({ type: 'UNDO' }));
  }
  if (redoButton) {
    redoButton.addEventListener('click', () => store.dispatch({ type: 'REDO' }));
  }

  if (searchEl) {
    const applySearch = debounce((value) => {
      store.dispatch({ type: 'FILTER_CHANGED', filter: { text: value } });
    }, 200);
    searchEl.addEventListener('input', (event) => {
      applySearch(/** @type {HTMLInputElement} */ (event.target).value);
    });
  }

  if (statsButton) {
    statsButton.addEventListener('click', async () => {
      const content = document.createElement('div');
      content.textContent = 'Загрузка панели статистики…';
      openModal({ title: 'Статистика', content });

      try {
        const panel = await loadStatsPanel();
        panel.renderStatsPanel(content, computeStats(presentState().tasks));
      } catch (error) {
        content.textContent = 'Модуль 5 ещё не выполнен: панель статистики недоступна.';
        console.warn('[TaskFlow] stats panel:', error);
      }
    });
  }

  if (themeButton) {
    const saved = themeStorage.load();
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.dataset.theme = saved;
    }

    themeButton.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme;
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      themeStorage.save(next);
    });
  }

  document.addEventListener('keydown', (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    const key = event.key.toLowerCase();
    if (key === 'z') {
      event.preventDefault();
      store.dispatch({ type: event.shiftKey ? 'REDO' : 'UNDO' });
    }
  });
}

async function bootstrap() {
  if (!boardEl) throw new Error('Не найден #board');

  bindUi();

  store.subscribe(() => {
    saveTasks(presentState().tasks);
    renderApp();
  });

  enableDragAndDrop(boardEl, (move) => {
    void handleMove(move);
  });

  const cached = loadCachedTasks();
  if (cached.length > 0) {
    store.dispatch({ type: 'TASKS_LOADED', tasks: cached });
    setStatus('Показаны сохранённые данные, идёт синхронизация…');
  } else {
    setStatus('Загрузка задач…');
  }

  const { tasks, errors } = await loadInitialData();
  if (errors.tasks) {
    setStatus('Не удалось загрузить задачи. Проверьте консоль и повторите позже.', true);
    notify(`Сервер недоступен: ${/** @type {Error} */ (errors.tasks).message}`, {
      type: 'error',
    });
    return;
  }

  store.dispatch({ type: 'TASKS_LOADED', tasks });
  setStatus('');
}

bootstrap().catch((error) => {
  console.warn('[TaskFlow] Приложение ещё не собрано из модулей:', error);
  const match = /TODO (\d+)\./.exec(/** @type {Error} */ (error).message);
  const prefix = match ? `Модуль ${Number(match[1])} ещё не выполнен. ` : '';
  setStatus(`${prefix}Пока показана статичная доска. Детали — в консоли.`, true);
});
