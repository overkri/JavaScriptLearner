/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 6 · УПРАЖНЕНИЕ 6.3 — Доска и делегирование событий
 * ═══════════════════════════════════════════════════════════
 *  Тема:           render, event delegation, closest, dataset
 *  Java-аналогия:  один listener на таблицу вместо listener'а в каждой ячейке
 *  Тесты:          npx vitest run tests/m06/Board.test.js   (jsdom)
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  renderBoard(root, tasksByStatus, onAction) рисует три колонки
 *  (todo, in-progress, done) с карточками из renderTaskCard.
 *  - Колонка: .board-column[data-status], заголовок, счётчик, карточки.
 *  - ОДИН обработчик click на root (делегирование). Повторный вызов
 *    renderBoard не должен добавлять второй listener.
 *  - По клику на элемент с [data-action] вызывайте
 *    onAction({ type, id }), где id из dataset.
 *  - Если onAction передали заново при перерисовке — используется новый.
 *
 *  ПОДСКАЗКА
 *  event.target.closest('[data-action]') поднимается от вложенного
 *  элемента до кнопки. Храните listener в WeakMap, чтобы не дублировать.
 *
 *  ЛОВУШКА
 *  Если вешать listener на каждую карточку, при перерисовке они
 *  теряются или накапливаются. Делегирование решает обе проблемы.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {import('../domain/task.js').Task} Task
 * @typedef {{ todo: Task[], 'in-progress': Task[], done: Task[] }} TasksByStatus
 * @typedef {(action: { type: string, id: string }) => void} BoardActionHandler
 */

/**
 * @param {HTMLElement} root
 * @param {TasksByStatus} tasksByStatus
 * @param {BoardActionHandler} [onAction]
 * @returns {HTMLElement}
 */
export function renderBoard(root, tasksByStatus, onAction = () => {}) {
  throw new Error('TODO 6.3: not implemented');
}
