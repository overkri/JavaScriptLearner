/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 5 · УПРАЖНЕНИЕ 5.1 — Barrel-файл core
 * ═══════════════════════════════════════════════════════════
 *  Тема:           re-export, named exports, ES-модули
 *  Java-аналогия:  package-level фасад (но без циклических импортов)
 *  Тесты:          npx vitest run tests/m05/barrels.test.js
 *  Уровень:        ★☆☆
 *
 *  ЗАДАНИЕ
 *  Сделайте core/index.js «бочкой»: реэкспортируйте из него
 *    EventEmitter, Store, AppError, ValidationError, NotFoundError,
 *    NetworkError и TaskList (последний лежит в domain/TaskList.js).
 *  Все имена должны импортироваться одной строкой:
 *    import { Store, ValidationError } from '../core/index.js';
 *
 *  ПОДСКАЗКА
 *  export { Store } from './Store.js';
 *  export * from './errors.js';
 *
 *  ЛОВУШКА
 *  Barrel удобен, но может создать циклические зависимости.
 *  Внутри модулей лучше импортировать конкретные файлы.
 * ═══════════════════════════════════════════════════════════
 */

// TODO 5.1: реэкспортируйте EventEmitter, Store, ошибки и TaskList
export {};
