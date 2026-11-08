/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 8 · УПРАЖНЕНИЕ 8.2 — Миграции схемы данных
 * ═══════════════════════════════════════════════════════════
 *  Тема:           версионирование, цепочка преобразований, идемпотентность
 *  Java-аналогия:  Flyway/Liquibase, но для JSON в localStorage
 *  Тесты:          npx vitest run tests/m08/migrations.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  migrate(data) приводит данные к version 3:
 *    v1: {version:1, tasks:[{id,title,status,priority,createdAt,dueDate?}]}
 *        — тегов нет, dueDate — ISO-строка или null.
 *    v2: tags: string[], dueDate — timestamp (number) или null,
 *        updatedAt ещё нет.
 *    v3: tags — lowercase без дублей, dueDate — 'YYYY-MM-DD' или null,
 *        updatedAt — ISO-строка.
 *  Требования:
 *  - цепочка v1 → v2 → v3, шаги можно применять по отдельности;
 *  - не мутировать вход (structuredClone);
 *  - идемпотентность: migrate(migrate(x)) эквивалентно migrate(x);
 *  - отсутствующий version считается 1;
 *  - неизвестная версия → Error;
 *  - updatedAt при миграции = task.updatedAt ?? task.createdAt ?? now.
 *
 *  ПОДСКАЗКА
 *  const version = data.version ?? 1;
 *  let result = structuredClone(data);
 *  if (version < 2) result = v1ToV2(result);
 *  if (version < 3) result = v2ToV3(result);
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @param {{ version?: number, tasks?: any[] }} data
 * @returns {{ version: 3, tasks: any[] }}
 */
export function migrate(data) {
  throw new Error('TODO 8.2: not implemented');
}
