# Квиз 03 · Объекты и массивы

Сначала запишите прогноз, затем проверьте его. Примеры соответствуют `task.js`, `taskOps.js`, `stats.js`, `tags.js` и `refQuiz.js`.

## 1. Поверхностная копия объекта

```js
const original = { title: 'Task', meta: { done: false } };
const copy = { ...original };
copy.meta.done = true;
console.log(original.meta.done);
```

<details>
<summary>Ответ</summary>

`true`.

Spread копирует только верхний уровень. Свойство `meta` в копии — та же ссылка на объект, что и в `original`, поэтому изменение видно в обоих. Для глубокой копии нужен `structuredClone(original)` (если значения это поддерживают).
</details>

## 2. Копия массива и ссылки на элементы

```js
const original = [{ id: 't1' }];
const copy = [...original];
copy.push({ id: 't2' });
copy[0].id = 't1-edited';

console.log(original.length, original[0].id);
console.log(copy === original);
```

<details>
<summary>Ответ</summary>

`1 't1-edited'`, затем `false`.

`[...original]` создаёт новый массив, поэтому `push` не меняет длину исходного. Но элементы копируются по ссылке: `copy[0]` и `original[0]` — один и тот же объект. Поэтому изменение `id` видно в `original`. Это ровно та ловушка, которую проверяет `refQuiz`.
</details>

## 3. Деструктуризация

```js
const task = {
  title: 'Купить молоко',
  priority: undefined,
  tags: ['work', 'home'],
};

const {
  title,
  priority = 'medium',
  tags: [firstTag, ...restTags],
} = task;
console.log(title, priority, firstTag, restTags);
```

<details>
<summary>Ответ</summary>

`Купить молоко medium work ['home']`.

Значение по умолчанию применяется при `undefined`, поэтому `priority` становится `'medium'` (если бы было `null`, осталось бы `null`). `tags: [firstTag, ...restTags]` одновременно переименовывает свойство и деструктурирует массив, собирая остаток через rest.
</details>

## 4. filter, flatMap и reduce

```js
const tasks = [
  { title: 'A', priority: 'high', tags: ['work'] },
  { title: 'B', priority: 'low', tags: ['home', 'work'] },
  { title: 'C', priority: 'high', tags: [] },
];

const result = tasks
  .filter((task) => task.priority === 'high')
  .flatMap((task) => task.tags)
  .reduce((acc, tag) => acc + tag.length, 0);

console.log(result);
```

<details>
<summary>Ответ</summary>

`4`.

`filter` оставляет задачи `A` и `C`, `flatMap` разворачивает их теги в `['work']`, `reduce` складывает длины: `4 + 0 = 4`. Если бы у `reduce` не было начального значения `0`, пустой массив после `flatMap` бросил бы `TypeError`.
</details>

## 5. sort и sortTasks

```js
const numbers = [10, 9, 1];
const sorted = numbers.sort();
console.log(sorted);
console.log(numbers === sorted);

const tasks = [
  { title: 'B', dueDate: '2026-02-01' },
  { title: 'A', dueDate: null },
  { title: 'C', dueDate: '2026-01-01' },
];
console.log(sortTasks(tasks, 'dueDate').map((task) => task.title));
```

<details>
<summary>Ответ</summary>

`[1, 10, 9]`, `true`, `['C', 'B', 'A']`.

`sort()` без компаратора сравнивает строки (`'10' < '9'`), мутирует массив и возвращает ту же ссылку. `sortTasks` из `taskOps.js` сначала копирует массив, сортирует по дате, а задачи с `dueDate === null` всегда ставит в конец — поэтому `A` последняя. `C` (январь) раньше `B` (февраль).
</details>

## 6. Иммутабельное обновление

```js
const tasks = [
  { id: 't1', status: 'todo' },
  { id: 't2', status: 'done' },
];

const updated = tasks.map((task) => (task.id === 't1' ? { ...task, status: 'done' } : task));

console.log(updated[0].status, tasks[0].status);
console.log(updated[1] === tasks[1]);
console.log(updated === tasks);
```

<details>
<summary>Ответ</summary>

`done todo`, `true`, `false`.

`map` создаёт новый массив, а spread — новый объект только для изменённой задачи. Исходная `tasks[0]` не меняется. Нетронутая `t2` сохраняет ссылочную идентичность — это важно для оптимизаций React и проверяется в `taskOps`. Сам массив `updated` — новая ссылка.
</details>

## 7. Set и Map

```js
const tags = ['Work', 'work', 'HOME', 'home'];
const unique = new Set(tags.map((tag) => tag.toLowerCase()));
const frequency = new Map();

for (const tag of unique) {
  frequency.set(tag, tags.filter((item) => item.toLowerCase() === tag).length);
}

console.log(unique.size);
console.log(frequency.get('work'));
console.log(frequency.get('missing'));
```

<details>
<summary>Ответ</summary>

`2`, `2`, `undefined`.

После `toLowerCase` получаем `['work', 'work', 'home', 'home']`, поэтому в `Set` два уникальных значения. `frequency.get('work')` равно `2`. Для отсутствующего ключа `Map.get` возвращает `undefined`, а не бросает ошибку — в коде подсчёта часто пишут `map.get(tag) ?? 0`.
</details>

## 8. forEach и await

```js
const ids = [];
['t1', 't2'].forEach(async (id) => {
  await Promise.resolve();
  ids.push(id);
});

console.log(ids.length);
```

<details>
<summary>Ответ</summary>

`0`.

`forEach` не умеет ждать асинхронный callback: он вызывает функции, получает Promise и сразу идёт дальше. `await Promise.resolve()` приостанавливает каждый callback до следующего микротаска, а `console.log` выполняется раньше — массив ещё пуст. Позже в нём окажутся `t1` и `t2`, но результат уже не проверить этой строкой. Нужен `for...of` с `await` или `Promise.all(array.map(...))`.
</details>
