# Модуль 12. Мини-React

Шпаргалка по `src/mini-react/`: `h()`, `render()`, хуки, `useStore` и компоненты. Цель — увидеть, как JSX, состояние и эффекты устроены «под капотом».

## h() и vnode

`h(type, props, ...children)` создаёт vnode `{ type, props, children }`.

- `type` — строка (`'div'`) или функция-компонент.
- `children` — **плоский** массив: вложенные массивы разворачиваются, `null`/`undefined`/`true`/`false` отбрасываются, строки и числа остаются.
- `props` копируется, исходный объект не мутируется; `props.children` объединяется с позиционными детьми и нормализуется.
- Один и тот же нормализованный массив кладётся в `vnode.children` и `vnode.props.children`.

```js
const vnode = h('div', { className: 'card' }, h('h3', {}, 'Title'), ['a', [null, 'b']]);
// children: [vnode_h3, 'a', 'b']
```

## render: vnode → DOM

`render(vnode, container)` возвращает `container` и **полностью перерисовывает** его через `replaceChildren` — без diff-алгоритма.

- Строка/число → текстовый узел; массив → `DocumentFragment`.
- Строковый `type` → `document.createElement`; атрибуты: `className`, `htmlFor`, `dataset`, `style`-объект, `value`, `checked`, `disabled`, `selected`.
- `true` → пустой атрибут; `onClick`/`onInput` → `addEventListener('click'/'input', handler)`.
- `key`, `ref`, `children` в DOM не попадают.
- Функциональный компонент вызывается как `type({ ...props, children })`, результат рендерится рекурсивно; вложенные компоненты поддерживаются.
- `rerenderRoot()` перерисовывает последний корень, `resetRenderState()` очищает его для тестов.
- Перед обходом вызывается `beginRender()`, вокруг компонента — `beginComponent()`/`endComponent()`.

## useState и useEffect на курсоре хуков

Хуки хранят слоты в модуле: `Map<componentIndex, slots[]>`, `hookIndex` сбрасывается в `beginComponent()`, `componentIndex` — в `beginRender()`.

`useState(initial)` → `[value, setState]`:

- `initial`-функция вызывается один раз (ленивая инициализация);
- `setState(next)` принимает значение или updater `(prev) => next`;
- если `Object.is(prev, next)`, перерисовки нет;
- иначе слот обновляется и вызывается `rerender` (`rerenderRoot`).

`useEffect(fn, deps)`:

- без `deps` — после каждого рендера;
- `[]` — один раз при монтировании;
- `deps` сравниваются поэлементно через `Object.is`;
- перед повторным запуском вызывается `cleanup` предыдущего эффекта;
- `resetHooks()` вызывает все cleanup и очищает слоты.

> **Упрощение мини-React:** эффект выполняется синхронно в процессе рендера, а не после
> commit, как в React. Поэтому не вызывайте `setState` из `useEffect` в этой реализации
> и не рассчитывайте, что DOM уже обновлён.

`configureHooks({ rerender })` связывает хуки с `render.js`; сигнатуры служебных функций менять нельзя.

## Правила хуков

1. Вызывайте хуки только на верхнем уровне компонента.
2. Не вызывайте их в `if`, циклах, `try/catch` или вложенных функциях.
3. Порядок вызовов должен быть одинаковым при каждом рендере.

Причина: слот определяется порядком вызова. Условный хук сдвигает курсор, и `useState` начинает читать состояние другого хука. React в такой ситуации бросает ошибку; мини-React молча портит состояние.

## useStore

`useStore(store)` — упрощённый `useSyncExternalStore`:

```js
const [, setVersion] = useState(0);
useEffect(() => store.subscribe(() => setVersion((version) => version + 1)), [store]);
return store.getState();
```

- Подписка живёт в `useEffect`, отписка возвращается как cleanup.
- `store.dispatch(...)` → listener → `setVersion` → `rerenderRoot()` → компонент читает свежий `getState()`.
- Без cleanup после смены `store` останутся дубли подписок и лишние перерисовки.

## key

- `key` — метаданные списка, а не DOM-атрибут: `render` его пропускает.
- Ключ должен быть стабильным и уникальным среди соседей: `task.id`, `status`.
- Индекс массива — плохой ключ для переупорядочиваемых списков: идентичность элемента теряется.
- В этой реализации перерисовка полная, поэтому `key` пока не ускоряет diff, но контракт тот же, что в React, и важен для будущего согласования.

## Компоненты

- `App({ store })` — `useStore`, `selectVisibleTasks`, `selectStats`, `SearchBar`, `Board`, строка «Показано: X из Y · просрочено: Z».
- `Board` — `section.board` с тремя `Column` (ключи `status`).
- `Column` — заголовок, счётчик, `TaskCard` с `key={task.id}`, пустая колонка — `p.column-empty`.
- `TaskCard` — только `h()`, никакого DOM напрямую.
- `SearchBar` — контролируемый `input[type="search"]`, `onInput` → `onChange(event.target.value)`.

## Java → JS

| Java                             | JavaScript                                        |
| -------------------------------- | ------------------------------------------------- |
| Swing/JavaFX-дерево компонентов  | vnode `{ type, props, children }`                 |
| Поля компонента + сеттеры        | слот `useState` + `setState`                      |
| `addListener` / `removeListener` | `useEffect` cleanup                               |
| `ObservableList` listener        | `useStore` subscribe/unsubscribe                  |
| Перестроение UI                  | `render` + `replaceChildren` (полная перерисовка) |
| `RecyclerView` stable ID         | `key` в списках                                   |

## Типичные ловушки

1. **Условные хуки.** `if (show) useState(...)` сдвигает курсор: следующий `useState` читает чужой слот, состояние «переезжает».
2. **Мутация вместо нового значения.** `state.tags.push(tag); setState(state)` не вызовет перерисовку: `Object.is` видит тот же объект. Нужны `[...tags, tag]` и новый объект.
3. **Забытый cleanup.** Подписка/таймер без cleanup в `useEffect` дублируется после каждой перерисовки; пустой `deps` без cleanup тоже оставляет слушателя при размонтировании.
4. **`key` как атрибут.** `key` не появляется в DOM; для переупорядочиваемого списка индекс — нестабильный ключ.
5. **Полная перерисовка.** `replaceChildren` теряет фокус, выделение и позицию курсора в uncontrolled-полях. Контролируемый `value` спасает значение, но не фокус.

## Запуск тестов модуля

```bash
npx vitest run tests/m12
```
