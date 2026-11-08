/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 12 · УПРАЖНЕНИЕ 12.5a — Компонент TaskCard
 * ═══════════════════════════════════════════════════════════
 *  Тема:           компонент как функция props → vnode
 *  Тесты:          npx vitest run tests/m12/components.test.js   (jsdom)
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  TaskCard({ task }) → vnode карточки:
 *  article.task-card.priority-{priority}[data-id], h3.task-card__title,
 *  div.task-card__tags с span.tag (#tag), footer с dueDate/приоритетом.
 *  Используйте h() из createElement.js. Никакого DOM напрямую!
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {import('../../domain/task.js').Task} Task
 */

/**
 * @param {{ task: Task }} props
 * @returns {import('../createElement.js').VNode}
 */
export function TaskCard({ task }) {
  throw new Error('TODO 12.5a: not implemented');
}
