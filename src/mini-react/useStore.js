/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 12 · УПРАЖНЕНИЕ 12.4 — useStore (useSyncExternalStore)
 * ═══════════════════════════════════════════════════════════
 *  Тема:           подписка на внешний store, useState + useEffect
 *  Java-аналогия:  listener на observable-модели
 *  Тесты:          npx vitest run tests/m12/useStore.test.js   (jsdom)
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  useStore(store) → текущее состояние store.
 *  - подпишитесь через store.subscribe;
 *  - при изменении заставьте компонент перерисоваться;
 *  - отписка должна происходить в cleanup эффекта (при смене store
 *    и при resetHooks).
 *
 *  ПОДСКАЗКА
 *  const [, setVersion] = useState(0);
 *  useEffect(() => store.subscribe(() => setVersion(v => v + 1)), [store]);
 *  return store.getState();
 *
 *  ЛОВУШКА
 *  Если подписаться без cleanup, после перерисовки появятся дубли
 *  подписок и лишние обновления.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @template S
 * @param {{ getState: () => S, subscribe: (listener: () => void) => () => void }} store
 * @returns {S}
 */
export function useStore(store) {
  throw new Error('TODO 12.4: not implemented');
}
