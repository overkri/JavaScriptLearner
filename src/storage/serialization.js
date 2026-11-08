/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 8 · УПРАЖНЕНИЕ 8.3 — Сериализация: Date, Map, Set
 * ═══════════════════════════════════════════════════════════
 *  Тема:           JSON.stringify/parse, replacer, reviver, циклы
 *  Java-аналогия:  Jackson с кастомными сериализаторами
 *  Тесты:          npx vitest run tests/m08/serialization.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  serializeTasks(tasks) → JSON-строка, deserializeTasks(json) → данные.
 *  JSON не умеет Date, Map, Set. Используйте маркеры:
 *    Date → { __type: 'Date', value: ISO }
 *    Set  → { __type: 'Set', values: [...] }
 *    Map  → { __type: 'Map', entries: [[k, v], ...] }
 *  и reviver, который вернёт настоящие Date/Set/Map.
 *
 *  Требования:
 *  - циклическая ссылка → понятный Error со словом circular (cause сохранить);
 *  - undefined-свойства JSON теряет — это нормально;
 *  - deserializeTasks должен бросать SyntaxError на битом JSON.
 *
 *  ПОДСКАЗКА
 *  В replacer значения Date приходят уже как строки (сработал toJSON),
 *  но исходное значение доступно через this[key] — используйте это.
 *  В reviver обрабатывайте объекты снизу вверх.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @param {any} tasks
 * @returns {string}
 */
export function serializeTasks(tasks) {
  throw new Error('TODO 8.3.1: not implemented');
}

/**
 * @param {string} json
 * @returns {any}
 */
export function deserializeTasks(json) {
  throw new Error('TODO 8.3.2: not implemented');
}
