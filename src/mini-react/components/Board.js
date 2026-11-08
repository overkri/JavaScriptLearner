/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 12 · УПРАЖНЕНИЕ 12.5c — Компонент Board
 * ═══════════════════════════════════════════════════════════
 *  Тема:           списки компонентов, map, key
 *  Тесты:          npx vitest run tests/m12/components.test.js   (jsdom)
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  Board({ tasksByStatus }) → section.board с тремя Column:
 *  todo «К выполнению», in-progress «В работе», done «Готово».
 *  Используйте key={status}.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {import('../../domain/task.js').Task} Task
 */

/**
 * @param {{ tasksByStatus: { todo: Task[], 'in-progress': Task[], done: Task[] } }} props
 * @returns {import('../createElement.js').VNode}
 */
export function Board({ tasksByStatus }) {
  throw new Error('TODO 12.5c: not implemented');
}
