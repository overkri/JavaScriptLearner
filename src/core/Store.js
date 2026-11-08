/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 4 · УПРАЖНЕНИЕ 4.3 — Store поверх EventEmitter
 * ═══════════════════════════════════════════════════════════
 *  Тема:           наследование, геттеры, static, shallow merge
 *  Java-аналогия:  ObservableProperty + подписка, но состояние
 *                  неизменяемое (как record)
 *  Тесты:          npx vitest run tests/m04/Store.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  Реализуйте class Store extends EventEmitter:
 *  - конструктор принимает начальное состояние (объект, по умолчанию {});
 *  - getState() возвращает текущее состояние;
 *  - setState(patch) иммутабельно сливает patch (shallow merge) и
 *    возвращает новое состояние. Если значения не изменились —
 *    состояние и подписчики не трогаются;
 *  - при изменении emit('change', next, previous);
 *  - subscribe(listener) → функция отписки (без немедленного вызова);
 *  - static from(initialState) → new Store(initialState);
 *  - геттер size — количество ключей состояния.
 *
 *  ЛОВУШКА
 *  setState({ count: state.count }) не должен будить UI: React и наш
 *  Store сравнивают значения/ссылки и пропускают лишние уведомления.
 * ═══════════════════════════════════════════════════════════
 */

import { EventEmitter } from './EventEmitter.js';

export class Store extends EventEmitter {
  /** @param {Record<string, any>} [initialState] */
  constructor(initialState = {}) {
    super();
    this.initialState = initialState;
    throw new Error('TODO 4.3.1: not implemented');
  }

  /** @returns {Record<string, any>} */
  getState() {
    throw new Error('TODO 4.3.2: not implemented');
  }

  /**
   * @param {Record<string, any>} patch
   * @returns {Record<string, any>}
   */
  setState(patch) {
    throw new Error('TODO 4.3.3: not implemented');
  }

  /**
   * @param {(state: Record<string, any>, previous: Record<string, any>) => void} listener
   * @returns {() => void}
   */
  subscribe(listener) {
    throw new Error('TODO 4.3.4: not implemented');
  }

  /**
   * @param {Record<string, any>} initialState
   * @returns {Store}
   */
  static from(initialState) {
    throw new Error('TODO 4.3.5: not implemented');
  }

  /** @returns {number} */
  get size() {
    throw new Error('TODO 4.3.6: not implemented');
  }
}
