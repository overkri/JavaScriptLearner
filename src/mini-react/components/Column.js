/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 12 · УПРАЖНЕНИЕ 12.5b — Компонент Column
 * ═══════════════════════════════════════════════════════════
 *  Тема:           композиция компонентов, key
 *  Тесты:          npx vitest run tests/m12/components.test.js   (jsdom)
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  Column({ status, title, tasks }) → section.board-column[data-status]
 *  с заголовком, счётчиком и карточками (h(TaskCard, { key, task })).
 *  Для пустой колонки — p.column-empty «Нет задач».
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {import('../../domain/task.js').Task} Task
 */

/**
 * @param {{ status: string, title: string, tasks: Task[] }} props
 * @returns {import('../createElement.js').VNode}
 */
export function Column({ status, title, tasks }) {
  throw new Error('TODO 12.5b: not implemented');
}
