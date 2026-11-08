/**
 * Эталон модуля 12.4 — useStore.
 */

import { useEffect, useState } from './hooks.js';

/**
 * @template S
 * @param {{ getState: () => S, subscribe: (listener: () => void) => () => void }} store
 * @returns {S}
 */
export function useStore(store) {
  const [, setVersion] = useState(0);

  useEffect(
    () =>
      store.subscribe(() => {
        setVersion((version) => version + 1);
      }),
    [store],
  );

  return store.getState();
}
