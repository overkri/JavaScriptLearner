// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeFetch } from '../../src/api/fakeServer.js';

function setupDom() {
  document.body.innerHTML = `
    <header>
      <input id="search" type="search" />
      <button id="btn-stats"></button>
      <button id="btn-undo"></button>
      <button id="btn-redo"></button>
      <button id="btn-add"></button>
      <button id="btn-theme"></button>
    </header>
    <div id="app-status" hidden></div>
    <section id="board">
      <section class="board-column" data-status="todo"><div class="column-cards"></div></section>
    </section>
    <div id="modal-root"></div>
    <div id="toast-root"></div>
  `;
}

function installMemoryStorage() {
  const data = new Map();
  const storage = {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
    clear: () => data.clear(),
  };
  Object.defineProperty(window, 'localStorage', { value: storage, configurable: true });
  return storage;
}

beforeEach(() => {
  setupDom();
  installMemoryStorage();
  fakeFetch.configure({ latency: [0, 0], errorRate: 0 });
  fakeFetch.reset();
});

describe('TaskFlow app smoke test', () => {
  it('boots, renders tasks, opens the form, filters and loads stats', async () => {
    await import('../../src/main.js');

    await vi.waitFor(
      () => {
        expect(document.querySelectorAll('.task-card').length).toBe(12);
      },
      { timeout: 5000 },
    );
    expect(document.querySelectorAll('.board-column')).toHaveLength(3);
    expect(document.querySelector('[data-status="done"] .task-card')).not.toBeNull();
    expect(document.getElementById('app-status').hidden).toBe(true);

    // Модалка + форма.
    document.getElementById('btn-add').click();
    await vi.waitFor(() => {
      expect(document.querySelector('.modal .task-form')).not.toBeNull();
    });
    const cancel = [...document.querySelectorAll('.modal button')].find(
      (button) => button.textContent === 'Отмена',
    );
    cancel.click();
    await vi.waitFor(() => {
      expect(document.querySelector('.modal-backdrop')).toBeNull();
    });

    // Поиск с debounce (модуль 2 + 10).
    const search = /** @type {HTMLInputElement} */ (document.getElementById('search'));
    search.value = 'окружение';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    await vi.waitFor(
      () => {
        expect(document.querySelectorAll('.task-card').length).toBe(1);
      },
      { timeout: 3000 },
    );
    expect(document.querySelector('.task-card__title').textContent).toContain('окружение');

    // Ленивая статистика (модуль 5).
    document.getElementById('btn-stats').click();
    await vi.waitFor(() => {
      expect(document.querySelector('.stats-grid')).not.toBeNull();
    });
  });
});
