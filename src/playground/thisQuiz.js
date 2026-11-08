/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 4 · УПРАЖНЕНИЕ 4.5 — Quiz: потеря this
 * ═══════════════════════════════════════════════════════════
 *  Тема:           this в методах, bind, call, стрелки
 *  Java-аналогия:  в Java this всегда привязан к объекту; в JS
 *                  метод можно «оторвать» и потерять контекст
 *  Тесты:          npx vitest run tests/m04/thisQuiz.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  Заполните predictions (ключи):
 *    methodCall          — результат obj.getName()
 *    detachedCallback    — String(fn()) для const fn = obj.getName
 *                          (метод написан как this?.name)
 *    boundMethod         — результат obj.getName.bind(obj)()
 *    callChangesThis     — obj.getName.call({ name: 'other' })
 *    arrowInMethod       — стрелка внутри метода читает this.name
 *
 *  Затем реализуйте:
 *  - createBoundCounter() — объект { increment, value }, где increment
 *    можно безопасно передать в колбэк: this не теряется (bind);
 *  - bindMethods(obj, ...names) — копия объекта, у которой указанные
 *    методы привязаны к оригиналу.
 *
 *  ЛОВУШКА
 *  addEventListener('click', obj.handler) теряет this. Исправления:
 *  bind, стрелка-обёртка или передача (event) => obj.handler(event).
 * ═══════════════════════════════════════════════════════════
 */

/** @type {Record<string, unknown>} */
export const predictions = {
  // TODO 4.5.1: заполните 5 прогнозов
};

/**
 * @returns {{ increment: () => number, readonly value: number }}
 */
export function createBoundCounter() {
  throw new Error('TODO 4.5.2: not implemented');
}

/**
 * @template {Record<string, any>} T
 * @param {T} obj
 * @param {...string} names
 * @returns {T}
 */
export function bindMethods(obj, ...names) {
  throw new Error('TODO 4.5.3: not implemented');
}
