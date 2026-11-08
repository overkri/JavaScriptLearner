/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 9 · УПРАЖНЕНИЕ 9.2 — Store с middleware
 * ═══════════════════════════════════════════════════════════
 *  Тема:           dispatch, subscribe, middleware-цепочка
 *  Java-аналогия:  цепочка фильтров/интерцепторов вокруг обработчика
 *  Тесты:          npx vitest run tests/m09/store.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  createStore(reducer, initialState, middlewares = []) →
 *  { getState, dispatch, subscribe }.
 *  - dispatch(action) вызывает reducer и возвращает action;
 *  - подписчики получают (nextState, previousState), только когда
 *    состояние реально изменилось (по ссылке);
 *  - subscribe(listener) возвращает unsubscribe;
 *  - middleware имеют вид (store) => (next) => (action) => result;
 *  - middlewares применяются слева направо: первый видит action первым,
 *    его post-код выполняется последним.
 *
 *  ПОДСКАЗКА
 *  let dispatch = middlewares.reduceRight(
 *    (next, mw) => mw(store)(next), baseDispatch);
 *  store.dispatch должен вызывать актуальный dispatch.
 *
 *  ЛОВУШКА
 *  Если замкнуть store.dispatch на baseDispatch, middleware не увидят
 *  вложенные dispatch (thunk). Нужна переменная dispatch.
 * ═══════════════════════════════════════════════════════════
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
  throw new Error('TODO 9.2: not implemented');
}
