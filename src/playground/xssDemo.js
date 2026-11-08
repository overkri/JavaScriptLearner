/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 6 · УПРАЖНЕНИЕ 6.7 — XSS: innerHTML vs textContent
 * ═══════════════════════════════════════════════════════════
 *  Тема:           XSS, innerHTML, textContent, безопасный рендер
 *  Java-аналогия:  экранирование вывода в шаблонизаторе; в JS
 *                  textContent делает это автоматически
 *  Тесты:          npx vitest run tests/m06/xssDemo.test.js   (jsdom)
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  - renderUnsafe(container, userInput) — намеренно небезопасная версия:
 *    вставьте строку через innerHTML внутри <p class="xss">.
 *    На ней тест покажет, что <img onerror> действительно создаётся.
 *  - renderSafe(container, userInput) — безопасная версия: textContent.
 *    Вредоносная строка должна остаться текстом, элемента <img> быть
 *    не должно.
 *
 *  ЛОВУШКА
 *  Даже «просто заголовок задачи» может содержать HTML. Любые данные
 *  пользователя — только через textContent или экранирование.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * ВНИМАНИЕ: намеренно небезопасно, только для демонстрации.
 * @param {HTMLElement} container
 * @param {string} userInput
 * @returns {HTMLElement}
 */
export function renderUnsafe(container, userInput) {
  throw new Error('TODO 6.7.1: not implemented');
}

/**
 * @param {HTMLElement} container
 * @param {string} userInput
 * @returns {HTMLElement}
 */
export function renderSafe(container, userInput) {
  throw new Error('TODO 6.7.2: not implemented');
}
