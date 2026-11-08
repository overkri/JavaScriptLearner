/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 6 · УПРАЖНЕНИЕ 6.8 — Quiz: события
 * ═══════════════════════════════════════════════════════════
 *  Тема:           всплытие/перехват, stopPropagation, preventDefault,
 *                  { once }, target vs currentTarget
 *  Java-аналогия:  обработчики Swing тоже всплывают? Нет — здесь
 *                  DOM-события проходят по дереву
 *  Тесты:          npx vitest run tests/m06/eventsQuiz.test.js   (jsdom)
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  Соберите демонстрации и верните наблюдаемый результат:
 *  1. runEventOrderDemo() — вложенные div/button, обработчики:
 *     outer capture, inner bubble, outer bubble. Верните массив
 *     строк в порядке вызова.
 *  2. runStopPropagationDemo() — inner останавливает всплытие;
 *     верните лог (внешний обработчик не должен сработать).
 *  3. runPreventDefaultDemo() — отмените действие клика и верните
 *     event.defaultPrevented (boolean).
 *  4. runOnceDemo() — обработчик с { once: true }, два клика;
 *     верните количество вызовов.
 *  5. runTargetVsCurrentTargetDemo() — верните
 *     { targetIsInner: boolean, currentTargetIsOuter: boolean }.
 *
 *  ПОДСКАЗКА
 *  new Event('click', { bubbles: true, cancelable: true }).
 *  capture-фаза: addEventListener(type, fn, true) или { capture: true }.
 * ═══════════════════════════════════════════════════════════
 */

/** @returns {string[]} */
export function runEventOrderDemo() {
  throw new Error('TODO 6.8.1: not implemented');
}

/** @returns {string[]} */
export function runStopPropagationDemo() {
  throw new Error('TODO 6.8.2: not implemented');
}

/** @returns {boolean} */
export function runPreventDefaultDemo() {
  throw new Error('TODO 6.8.3: not implemented');
}

/** @returns {number} */
export function runOnceDemo() {
  throw new Error('TODO 6.8.4: not implemented');
}

/** @returns {{ targetIsInner: boolean, currentTargetIsOuter: boolean }} */
export function runTargetVsCurrentTargetDemo() {
  throw new Error('TODO 6.8.5: not implemented');
}
