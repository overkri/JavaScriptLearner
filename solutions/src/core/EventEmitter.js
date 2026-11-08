/**
 * Эталон модуля 4.2 — EventEmitter.
 */

export class EventEmitter {
  /** @type {Map<string, Set<(...args: any[]) => void>>} */
  #listeners = new Map();

  /**
   * @param {string} event
   * @param {(...args: any[]) => void} handler
   * @returns {() => void} unsubscribe
   */
  on(event, handler) {
    if (typeof handler !== 'function') {
      throw new TypeError('EventEmitter.on expects a function');
    }
    let handlers = this.#listeners.get(event);
    if (!handlers) {
      handlers = new Set();
      this.#listeners.set(event, handlers);
    }
    handlers.add(handler);
    return () => this.off(event, handler);
  }

  /**
   * @param {string} event
   * @param {(...args: any[]) => void} [handler]
   * @returns {this}
   */
  off(event, handler) {
    const handlers = this.#listeners.get(event);
    if (!handlers) return this;

    if (handler === undefined) {
      this.#listeners.delete(event);
      return this;
    }

    handlers.delete(handler);
    if (handlers.size === 0) this.#listeners.delete(event);
    return this;
  }

  /**
   * @param {string} event
   * @param {(...args: any[]) => void} handler
   * @returns {() => void} unsubscribe
   */
  once(event, handler) {
    /** @param {...any} args */
    const wrapper = (...args) => {
      this.off(event, wrapper);
      handler.apply(this, args);
    };
    return this.on(event, wrapper);
  }

  /**
   * @param {string} event
   * @param {...any} args
   * @returns {boolean}
   */
  emit(event, ...args) {
    const handlers = this.#listeners.get(event);
    if (!handlers || handlers.size === 0) return false;

    for (const handler of [...handlers]) {
      try {
        handler.apply(this, args);
      } catch (error) {
        console.error(`EventEmitter: error in "${event}" listener`, error);
      }
    }
    return true;
  }
}
