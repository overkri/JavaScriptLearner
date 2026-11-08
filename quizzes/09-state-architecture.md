# Квиз 09 · Состояние и архитектура

> 8 вопросов: сначала предскажите вывод и объясните его, затем откройте ответ.
> Проверить себя можно тестами модуля: `npx vitest run tests/m09`.

## 1. Ссылки после reducer

Что выведет код и почему?

```js
const state = {
  tasks: [{ id: 't1', status: 'todo' }],
  filter: { status: 'all', priority: 'all', tag: null, text: '' },
};

const next = reducer(state, { type: 'TASK_MOVED', id: 't1', status: 'done' });

console.log(next.tasks[0].status, state.tasks[0].status);
console.log(next === state, next.filter === state.filter);
```

<details>
<summary>Ответ</summary>

```
done todo
false true
```

Reducer иммутабелен: `moveTask` создаёт новый массив задач и новую задачу, исходный `state` не меняется. При этом `filter` не затрагивался, поэтому `next.filter` — та же ссылка. `next !== state`, потому что изменился `tasks`.

</details>

## 2. Неизвестное действие

Что выведет код?

```js
const state = createInitialState();
console.log(reducer(state, { type: 'UNKNOWN' }) === state);
console.log(reducer(state, {}) === state);
console.log(reducer(state, undefined) === state);
```

<details>
<summary>Ответ</summary>

```
true
true
true
```

Reducer обязан вернуть **тот же объект** для неизвестного действия и для action без `type`. Это не оптимизация «на всякий случай»: store сравнивает ссылки и не уведомляет подписчиков, а `withHistory` не пишет пустую запись в историю.

</details>

## 3. Мутация вместо иммутабельности

Что выведет код? Сколько раз сработает подписчик?

```js
const badReducer = (state = { tasks: [] }, action) => {
  if (action.type === 'TASK_ADDED') state.tasks.push(action.task);
  return state;
};

const store = createStore(badReducer, { tasks: [] });
store.subscribe(() => console.log('changed'));
store.dispatch({ type: 'TASK_ADDED', task: { id: 't1' } });

console.log(store.getState().tasks.length);
```

<details>
<summary>Ответ</summary>

```
1
```

`changed` не печатается: `push` мутировал массив, но вернулся тот же объект state. `createStore` видит `nextState === state` и не вызывает подписчиков. Данные изменились «втихую» — UI не перерисуется, undo/redo не запишет шаг. Правильный вариант — `{ ...state, tasks: [...state.tasks, action.task] }` или `addTask`.

</details>

## 4. Порядок middleware

Что выведет код?

```js
const calls = [];
const makeMiddleware = (name) => (store) => (next) => (action) => {
  calls.push(`${name}:before`);
  const result = next(action);
  calls.push(`${name}:after`);
  return result;
};

const store = createStore((state = 0, action) => (action.type === 'INC' ? state + 1 : state), 0, [
  makeMiddleware('first'),
  makeMiddleware('second'),
]);

store.dispatch({ type: 'INC' });
console.log(calls.join(','));
```

<details>
<summary>Ответ</summary>

```
first:before,second:before,second:after,first:after
```

Middleware применяются слева направо: `first` первым видит action, передаёт `next` в `second`. Post-код выполняется в обратном порядке, как стек вызовов. Внутри `next` в итоге вызывается reducer.

</details>

## 5. Где сохраняет `persist`

Что выведет код?

```js
const data = new Map();
const storage = {
  getItem: (key) => data.get(key) ?? null,
  setItem: (key, value) => data.set(key, value),
  removeItem: (key) => data.delete(key),
};

const store = createStore(
  (state = { count: 0 }, action) => (action.type === 'INC' ? { count: state.count + 1 } : state),
  { count: 0 },
  [persist('app', storage)],
);

store.dispatch({ type: 'INC' });
console.log(data.get('app'));
```

<details>
<summary>Ответ</summary>

```
{"count":1}
```

`persist` вызывает `next(action)` (то есть reducer), и только **после** этого сериализует `store.getState()`. Если сохранять до `next`, в `localStorage` попадёт старое состояние. Ошибки `JSON.stringify` и `setItem` middleware глотает, чтобы не ломать dispatch.

</details>

## 6. Undo/Redo и очистка `future`

Что выведет код?

```js
const history = withHistory((state = 0, action) => (action.type === 'INC' ? state + 1 : state));

let state = history(undefined, { type: '@@INIT' });
state = history(state, { type: 'INC' });
state = history(state, { type: 'INC' });
state = history(state, { type: 'UNDO' });
console.log(state.present, JSON.stringify(state.past), JSON.stringify(state.future));

state = history(state, { type: 'INC' });
console.log(state.present, JSON.stringify(state.past), JSON.stringify(state.future));
```

<details>
<summary>Ответ</summary>

```
1 [0] [2]
2 [0,1] []
```

После двух `INC`: `past = [0, 1]`, `present = 2`. `UNDO` переносит `2` в `future`, возвращает `present = 1`, `past = [0]`. Новое действие `INC` считается новой веткой: `present` становится `2`, старый `present` уходит в `past`, а `future` **очищается** — Redo больше недоступен.

</details>

## 7. Thunk

Что выведет код?

```js
const store = createStore((state = 0, action) => (action.type === 'INC' ? state + 1 : state), 0, [
  asyncThunk,
]);

const result = store.dispatch((dispatch, getState) => {
  dispatch({ type: 'INC' });
  dispatch({ type: 'INC' });
  return getState();
});

console.log(result, store.getState());
```

<details>
<summary>Ответ</summary>

```
2 2
```

`asyncThunk` распознаёт action-функцию и вызывает её с `dispatch` и `getState`. Вложенные `dispatch({ type: 'INC' })` снова проходят через цепочку middleware и попадают в reducer. Thunk возвращает `getState()`, поэтому `result === 2`.

</details>

## 8. Мемоизация селектора

Что выведет код?

```js
let calls = 0;

const selector = createSelector(
  (state) => state.tasks,
  (tasks) => {
    calls += 1;
    return tasks.filter((task) => !task.done);
  },
);

const state = { tasks: [{ id: 't1', done: false }] };
const first = selector(state);
const second = selector(state);

console.log(first === second, calls);
```

<details>
<summary>Ответ</summary>

```
true 1
```

`createSelector` запоминает последние входы и сравнивает их через `Object.is`. Оба вызова получают один и тот же массив `state.tasks`, поэтому `resultFn` выполняется только один раз и возвращается та же ссылка. Если объявить такой селектор внутри компонента, кэш будет создаваться заново при каждом рендере — поэтому селекторы объявляют на уровне модуля.

</details>
