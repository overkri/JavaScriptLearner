# 09 · Состояние и архитектура

> Модуль 9: упражнения `src/state/reducer.js`, `src/state/store.js`, `src/state/middleware.js`,
> `src/state/history.js`, `src/state/selectors.js`.
>
> **Тесты модуля:** `npx vitest run tests/m09` · [папка тестов](../tests/m09)

**TaskFlow:** единый store, фильтры, undo/redo, горячие клавиши `Ctrl+Z` / `Ctrl+Shift+Z`.

## Однонаправленный поток

```
UI → dispatch(action) → reducer(state, action) → новый state → подписчики → UI
```

Состояние только читается; менять его можно исключительно через `dispatch`. Это делает изменения предсказуемыми и позволяет писать историю.

## Reducer

`reducer(state, action)` — **чистая** функция без побочных эффектов. State: `{ tasks: Task[], filter: TaskFilter }`.

| Action                       | Результат                        |
| ---------------------------- | -------------------------------- |
| `TASKS_LOADED { tasks }`     | заменить список                  |
| `TASK_ADDED { task }`        | `addTask`                        |
| `TASK_UPDATED { id, patch }` | `replaceTask`                    |
| `TASK_REMOVED { id }`        | `removeTask`                     |
| `TASK_MOVED { id, status }`  | `moveTask`                       |
| `FILTER_CHANGED { filter }`  | shallow-merge с текущим `filter` |

Неизвестное действие или action без `type` возвращает **тот же объект** `state`. Если `tasks` не изменились — тоже тот же state. `createInitialState()` создаёт свежий `{ tasks: [], filter: { status: 'all', priority: 'all', tag: null, text: '' } }`.

## Store и middleware

```js
const store = createStore(reducer, initialState, [logger, persist('key'), asyncThunk]);
store.getState();
store.dispatch({ type: 'TASK_ADDED', task });
const unsubscribe = store.subscribe((state, previous) => {});
```

- базовый `dispatch(action)` вызывает reducer и возвращает action; подписчики получают `(nextState, previousState)` и вызываются, только если ссылка на state изменилась.
- Middleware: `(store) => (next) => (action) => result`; применяются слева направо — первый видит action первым, его post-код выполняется последним.
- `store.dispatch` должен идти через актуальную переменную `dispatch`, иначе вложенный dispatch из middleware минует цепочку.
- `logger` печатает state до и после; `persist(key, storage)` сохраняет **после** `next(action)`; `asyncThunk` при action-функции вызывает `action(dispatch, getState)`.

## Undo/Redo

`withHistory(reducer, { limit = 50 })` оборачивает reducer в `{ past, present, future }`.

- обычное действие: старый `present` → в `past` (не длиннее `limit`), `future` очищается;
- `UNDO`: последний `past` → `present`, текущий `present` → `future`;
- `REDO`: первый `future` → `present`, текущий `present` → `past`;
- пустая история → тот же state; `canUndo(state)` / `canRedo(state)` проверяют длины.

Новое действие после `UNDO` обязано очистить `future`, иначе Redo уведёт в «мёртвую» ветку.

## Селекторы и мемоизация

`createSelector(...inputSelectors, resultFn)` запоминает **последний** набор входов и сравнивает их через `Object.is`. Если входы те же — возвращает тот же результат, не вызывая `resultFn`.

- `selectVisibleTasks(state)` — `filterTasks(state.tasks, state.filter)`;
- `selectStats(state)` — `computeStats(state.tasks)`;
- `selectTags(state)` — `collectTags(state.tasks)`.

Селекторы объявляются на уровне модуля. Созданный внутри компонента селектор получает новый кэш на каждый рендер.

## Java → JS

| Java                  | JavaScript                           |
| --------------------- | ------------------------------------ |
| Команда + обработчик  | action + reducer                     |
| EventBus / listeners  | `dispatch` + `subscribe`             |
| Цепочка интерцепторов | middleware                           |
| Memento / undo stack  | `withHistory`: `past/present/future` |
| Кэширующий getter     | `createSelector` на `Object.is`      |

## Типичные ловушки

1. **Мутация state** (`state.tasks.push(...)`) — ссылка та же, подписчики не сработают, история не запишется. Нужны новые массивы и объекты.
2. **Новый объект state без реальных изменений** — лишние перерисовки; возвращайте тот же state.
3. **`persist` до `next`** — сохранит старое состояние; сначала reducer, потом запись.
4. **Селектор внутри компонента** — кэш создаётся заново, мемоизация не работает.
5. **Забыли очистить `future` после нового действия** — Redo приводит к устаревшей ветке истории.
