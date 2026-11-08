/**
 * Эталон модуля 9.2 — store с middleware.
 */

/**
 * @typedef {{ getState: () => any, dispatch: (action: any) => any, subscribe: (listener: (state: any, previous: any) => void) => () => void }} Store
 */

/**
 * @param {(state: any, action: any) => any} reducer
 * @param {any} initialState
 * @param {Array<(store: Store) => (next: (action: any) => any) => (action: any) => any>} [middlewares]
 * @returns {Store}
 */
export function createStore(reducer, initialState, middlewares = []) {
  let state = initialState;
  /** @type {Set<(state: any, previous: any) => void>} */
  const listeners = new Set();

  /**
   * @param {any} action
   * @returns {any}
   */
  const baseDispatch = (action) => {
    const nextState = reducer(state, action);
    if (nextState !== state) {
      const previous = state;
      state = nextState;
      for (const listener of [...listeners]) {
        listener(state, previous);
      }
    }
    return action;
  };

  /** @type {(action: any) => any} */
  let dispatch = baseDispatch;

  /** @type {Store} */
  const store = {
    getState: () => state,
    dispatch: (action) => dispatch(action),
    subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('subscribe expects a function');
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };

  dispatch = middlewares.reduceRight(
    (next, middleware) => middleware(store)(next),
    baseDispatch,
  );

  return store;
}
