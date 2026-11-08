/**
 * Эталон модуля 4.3 — Store.
 */

import { EventEmitter } from './EventEmitter.js';

export class Store extends EventEmitter {
  /** @type {Record<string, any>} */
  #state;

  /** @param {Record<string, any>} [initialState] */
  constructor(initialState = {}) {
    super();
    this.#state = initialState;
  }

  /** @returns {Record<string, any>} */
  getState() {
    return this.#state;
  }

  /**
   * @param {Record<string, any>} patch
   * @returns {Record<string, any>}
   */
  setState(patch) {
    if (!patch || typeof patch !== 'object') return this.#state;

    const keys = Object.keys(patch);
    const changed = keys.some((key) => !Object.is(this.#state[key], patch[key]));
    if (!changed) return this.#state;

    const previous = this.#state;
    this.#state = { ...previous, ...patch };
    this.emit('change', this.#state, previous);
    return this.#state;
  }

  /**
   * @param {(state: Record<string, any>, previous: Record<string, any>) => void} listener
   * @returns {() => void}
   */
  subscribe(listener) {
    return this.on('change', listener);
  }

  /**
   * @param {Record<string, any>} initialState
   * @returns {Store}
   */
  static from(initialState) {
    return new Store(initialState);
  }

  /** @returns {number} */
  get size() {
    return Object.keys(this.#state).length;
  }
}
