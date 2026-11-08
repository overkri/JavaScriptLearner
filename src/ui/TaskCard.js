/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 6 · УПРАЖНЕНИЕ 6.2 — Карточка задачи
 * ═══════════════════════════════════════════════════════════
 *  Тема:           createElement, классы, data-атрибуты, XSS
 *  Java-аналогия:  render-метод ячейки TableView
 *  Тесты:          npx vitest run tests/m06/TaskCard.test.js   (jsdom)
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  renderTaskCard(task) → HTMLElement:
 *  - <article class="task-card priority-{priority}" data-id="{id}">;
 *  - заголовок .task-card__title и описание .task-card__description
 *    (только текст!);
 *  - теги .tag с "#" перед именем;
 *  - дедлайн .task-card__due; если isOverdue(task) — добавьте класс
 *    is-overdue; без дедлайна — текст «без срока»;
 *  - приоритет .task-card__priority;
 *  - кнопки с data-action="edit" и data-action="delete",
 *    у обеих data-id задачи и aria-label;
 *  - draggable="true" для будущего Drag & Drop.
 *
 *  ПОДСКАЗКА
 *  Используйте h() из dom.js. Дочерние строки попадут в textContent.
 *
 *  ЛОВУШКА
 *  Никогда не вставляйте task.title через innerHTML — заголовок
 *  приходит от пользователя.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {import('../domain/task.js').Task} Task
 */

/**
 * @param {Task} task
 * @returns {HTMLElement}
 */
export function renderTaskCard(task) {
  throw new Error('TODO 6.2: not implemented');
}
