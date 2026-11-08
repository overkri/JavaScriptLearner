/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 5 · УПРАЖНЕНИЕ 5.2 — Barrel домена и default export
 * ═══════════════════════════════════════════════════════════
 *  Тема:           default vs named exports, реэкспорт
 *  Java-аналогия:  статический импорт пакета; default — это
 *                  «главный» экспорт модуля
 *  Тесты:          npx vitest run tests/m05/barrels.test.js
 *  Уровень:        ★☆☆
 *
 *  ЗАДАНИЕ
 *  domain/index.js должен:
 *  - экспортировать createTask как default;
 *  - экспортировать createTask, updateTask, isOverdue (named);
 *  - реэкспортировать всё из taskOps.js, stats.js, tags.js,
 *    TaskList.js и priority.js.
 *
 *  ПОДСКАЗКА
 *  export { createTask as default, createTask, updateTask, isOverdue }
 *    from './task.js';
 *  export * from './taskOps.js';
 *
 *  ЛОВУШКА
 *  Из одного модуля может быть только один default export.
 * ═══════════════════════════════════════════════════════════
 */

// TODO 5.2: соберите barrel домена
export {};
