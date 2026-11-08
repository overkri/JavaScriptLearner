/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 3 · УПРАЖНЕНИЕ 3.5 — Теги: Set, Map, flatMap
 * ═══════════════════════════════════════════════════════════
 *  Тема:           Set, Map, flatMap, Array.from, иммутабельность
 *  Java-аналогия:  HashSet<String>, HashMap<String, Integer>
 *  Тесты:          npx vitest run tests/m03/tags.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  1. collectTags(tasks) → Set<string>: все уникальные теги в lowercase.
 *  2. tagFrequency(tasks) → Map<string, number>: сколько раз встречается.
 *  3. renameTag(tasks, from, to) → новый массив задач, где тег from
 *     заменён на to (lowercase). Если to уже есть — дубля быть не должно.
 *     Если to пустой — тег удаляется. Исходные задачи не мутировать.
 *
 *  ПОДСКАЗКИ
 *  - flatMap(task => task.tags ?? []) разворачивает теги всех задач.
 *  - Map.prototype.get(tag) ?? 0 — счётчик.
 *  - При переименовании используйте Set для дедупликации.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {import('./task.js').Task} Task
 */

/**
 * @param {Task[]} tasks
 * @returns {Set<string>}
 */
export function collectTags(tasks) {
  throw new Error('TODO 3.5.1: not implemented');
}

/**
 * @param {Task[]} tasks
 * @returns {Map<string, number>}
 */
export function tagFrequency(tasks) {
  throw new Error('TODO 3.5.2: not implemented');
}

/**
 * @param {Task[]} tasks
 * @param {string} from
 * @param {string} to
 * @returns {Task[]}
 */
export function renameTag(tasks, from, to) {
  throw new Error('TODO 3.5.3: not implemented');
}
