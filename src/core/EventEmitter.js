/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 4 · УПРАЖНЕНИЕ 4.2 — EventEmitter
 * ═══════════════════════════════════════════════════════════
 *  Тема:           class, приватные поля, Map, Set, callbacks
 *  Java-аналогия:  слушатели событий / Observer, но функции — значения
 *  Тесты:          npx vitest run tests/m04/EventEmitter.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  Реализуйте class EventEmitter:
 *  - #listeners — приватное поле Map<string, Set<Function>>;
 *  - on(event, handler) → функция отписки;
 *  - off(event, handler?) — убрать обработчик или все обработчики события;
 *  - once(event, handler) — сработать один раз и отписаться;
 *  - emit(event, ...args) — вызвать всех, вернуть true/false.
 *
 *  ТРЕБОВАНИЯ
 *  - Отписка во время emit не ломает текущую рассылку (итерируйтесь
 *    по копии набора).
 *  - Ошибка одного обработчика не мешает остальным (поймайте её
 *    и выведите console.error).
 *  - События изолированы: 'change' не вызывает обработчики 'save'.
 *
 *  ПОДСКАЗКА
 *  Приватное поле объявляется так: #listeners = new Map();
 *  Снаружи его нельзя прочитать даже через Object.keys.
 * ═══════════════════════════════════════════════════════════
 */

export class EventEmitter {
  /**
   * @param {string} event
   * @param {(...args: any[]) => void} handler
   * @returns {() => void} unsubscribe
   */
  on(event, handler) {
    throw new Error('TODO 4.2.1: not implemented');
  }

  /**
   * @param {string} event
   * @param {(...args: any[]) => void} [handler]
   * @returns {this}
   */
  off(event, handler) {
    throw new Error('TODO 4.2.2: not implemented');
  }

  /**
   * @param {string} event
   * @param {(...args: any[]) => void} handler
   * @returns {() => void} unsubscribe
   */
  once(event, handler) {
    throw new Error('TODO 4.2.3: not implemented');
  }

  /**
   * @param {string} event
   * @param {...any} args
   * @returns {boolean} были ли слушатели
   */
  emit(event, ...args) {
    throw new Error('TODO 4.2.4: not implemented');
  }
}
