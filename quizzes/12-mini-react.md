# Квиз 12. Мини-React

1. Что выведет этот код и почему?

```js
const vnode = h('div', { id: 'root' }, 'a', [h('span', {}, 'b'), [null, false, 'c']], true);

console.log(vnode.children.length);
console.log(vnode.children.map((child) => (typeof child === 'string' ? child : child.type)));
console.log(vnode.props.children.length);
```

<details><summary>Ответ</summary>

```text
3
[ 'a', 'span', 'c' ]
3
```

`h` рекурсивно разворачивает вложенные массивы и отбрасывает `null`, `undefined`, `true` и `false`. Остаются строка `'a'`, vnode `span` и строка `'c'`. Тот же нормализованный массив записывается в `props.children`, поэтому длина там тоже 3. Без нормализации `render` получил бы вложенный массив и создал лишние узлы.

</details>

2. Что выведет этот код и почему?

```js
function Card({ title, children }) {
  return h('section', { className: 'card' }, h('h2', {}, title), children);
}

const root = document.createElement('div');
render(h(Card, { title: 'Hi' }, h('span', {}, 'Body')), root);
console.log(root.innerHTML);
```

<details><summary>Ответ</summary>

```html
<section class="card">
  <h2>Hi</h2>
  <span>Body</span>
</section>
```

`h(Card, ...)` создаёт vnode с `type === Card`. `render` видит функцию и вызывает `Card({ ...props, children })`; `children` — нормализованный массив `[vnode_span]`. Результат рендерится рекурсивно, поэтому `section` содержит заголовок и `span`. `className` превращается в атрибут `class`.

</details>

3. Что выведет этот код после одного клика и почему?

```js
function Counter() {
  const [count, setCount] = useState(0);
  return h(
    'button',
    {
      onClick: () => {
        setCount(count + 1);
        setCount(count + 1);
      },
    },
    String(count),
  );
}

render(h(Counter), document.querySelector('#root'));
document.querySelector('#root button').click();
console.log(document.querySelector('#root').textContent);
```

<details><summary>Ответ</summary>

```text
1
```

Оба вызова `setCount` замкнуты на `count` из текущего рендера, где `count === 0`. Первый вызов записывает `1` и запускает перерисовку; второй снова вычисляет `0 + 1 === 1`, а `Object.is(1, 1)` истинно — повторной перерисовки нет. Чтобы получить `2`, нужен функциональный updater: `setCount((value) => value + 1)` дважды.

</details>

4. Почему при переключении `show` состояние компонента ломается?

```js
function Component({ show }) {
  if (show) {
    const [label] = useState('shown');
    console.log('label:', label);
  }
  const [count, setCount] = useState(0);
  return h('div', {}, String(count));
}
```

<details><summary>Ответ</summary>

Хуки различаются по порядку вызова, а не по имени. При `show === true` слот `0` занят `label`, слот `1` — `count`. Если затем `show` станет `false`, первый `useState` компонента (уже `count`) прочитает слот `0` со значением `'shown'`, а не число `0`; состояние «переедет». Поэтому хуки нельзя вызывать в `if`, циклах и вложенных функциях — только на верхнем уровне и всегда в одном порядке. В React это правило проверяется и бросает ошибку; мини-React молча читает чужой слот.

</details>

5. Что выведет код после двух кликов и почему?

```js
function Component() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log('effect', count);
    return () => console.log('cleanup', count);
  }, [count]);
  return h('button', { onClick: () => setCount(count + 1) }, String(count));
}

render(h(Component), document.querySelector('#root'));
document.querySelector('#root button').click();
document.querySelector('#root button').click();
```

<details><summary>Ответ</summary>

```text
effect 0
cleanup 0
effect 1
cleanup 1
effect 2
```

`useEffect` сравнивает `deps` поэлементно через `Object.is`. При первом рендере эффект запускается; после изменения `count` сначала вызывается cleanup предыдущего эффекта, затем новый эффект. После второго клика повторяется то же самое. Cleanup для `effect 2` не вызывается, пока компонент не размонтируется или не будет вызван `resetHooks()`.

</details>

6. Что выведет этот код и что произойдёт с `key`?

```js
const root = document.createElement('div');
const items = ['a', 'b'];
render(
  h(
    'ul',
    {},
    items.map((item) => h('li', { key: item }, item)),
  ),
  root,
);
console.log(root.innerHTML);
console.log(root.querySelector('li').hasAttribute('key'));
```

<details><summary>Ответ</summary>

```text
<ul><li>a</li><li>b</li></ul>
false
```

`key` — метаданные списка для согласования, а не HTML-атрибут. В `render.js` ключи `key`, `ref` и `children` явно пропускаются при применении props, поэтому в DOM их нет. В мини-React перерисовка полная, и `key` пока не влияет на diff, но контракт как в React: ключ должен быть стабильным и уникальным среди соседей (`task.id`, `status`), а не индексом массива.

</details>

7. Что выведет код после `dispatch` и почему?

```js
const store = createStore(reducer, createInitialState());

function Display() {
  const state = useStore(store);
  return h('span', { id: 'count' }, String(state.tasks.length));
}

const root = document.createElement('div');
render(h(Display), root);
store.dispatch({ type: 'TASKS_LOADED', tasks: [{ id: 't1' }] });
console.log(root.querySelector('#count').textContent);
```

<details><summary>Ответ</summary>

```text
1
```

`useStore` подписывается на `store` в `useEffect` и возвращает `store.getState()`. `dispatch` вызывает reducer, затем слушателей; listener делает `setVersion((v) => v + 1)`, что запускает `rerenderRoot()`. Компонент читает уже новое состояние, поэтому в `span` попадает `1`. Cleanup эффекта отписывается от store при смене store или размонтировании.

</details>

8. Что выведет этот код после ввода и почему?

```js
let renders = 0;

function Search() {
  renders += 1;
  const [value, setValue] = useState('');
  return h('input', {
    value,
    onInput: (event) => setValue(event.target.value),
  });
}

const root = document.createElement('div');
render(h(Search), root);
const input = root.querySelector('input');
input.value = 'milk';
input.dispatchEvent(new Event('input', { bubbles: true }));
console.log(renders, root.querySelector('input').value);
```

<details><summary>Ответ</summary>

```text
2 milk
```

Первый рендер — начальное значение `''`. Событие `input` вызывает `setValue('milk')`, слот обновляется, и `rerenderRoot()` полностью перерисовывает корень. Второй рендер создаёт новый `input` с `value: 'milk'`, поэтому `renders === 2`, а в DOM снова `milk`. Это контролируемый input: значение живёт в состоянии, а не только в DOM. Минус полной перерисовки — потеря фокуса и позиции курсора в реальном приложении.

</details>
