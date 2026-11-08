# Квиз 08 · Хранилище и сериализация

> 7 вопросов: сначала предскажите вывод и объясните его, затем откройте ответ.
> Проверить себя можно тестами модуля: `npx vitest run tests/m08`.

## 1. Что JSON теряет в объекте и в массиве

Что выведет код и почему?

```js
console.log(JSON.stringify({ a: undefined, b: () => 1, c: null }));
console.log(JSON.stringify([undefined, () => 1, NaN]));
```

<details>
<summary>Ответ</summary>

```
{"c":null}
[null,null,null]
```

В объекте свойства с `undefined` и функциями **пропускаются** — остаётся только `c: null`. В массиве позиции нельзя пропустить, поэтому неподдерживаемые значения заменяются на `null`: `undefined`, функция и `NaN` дают `null`. `Infinity` тоже стал бы `null`.

</details>

## 2. `Date` после `JSON.stringify`

Что выведет код?

```js
const json = JSON.stringify({ due: new Date('2026-12-01T00:00:00.000Z') });
console.log(json);
console.log(typeof JSON.parse(json).due);
```

<details>
<summary>Ответ</summary>

```
{"due":"2026-12-01T00:00:00.000Z"}
string
```

У `Date` есть метод `toJSON()`, который `JSON.stringify` вызывает автоматически. В JSON попадает ISO-строка. После `parse` это уже обычная строка — `instanceof Date` даст `false`. Именно поэтому `serializeTasks` добавляет маркер `__type: 'Date'` и `deserializeTasks` восстанавливает объект.

</details>

## 3. `Map` и `Set` в JSON

Что выведет код?

```js
console.log(JSON.stringify(new Map([['a', 1]])));
console.log(JSON.stringify(new Set([1, 2])));
```

<details>
<summary>Ответ</summary>

```
{}
{}
```

У `Map` и `Set` нет собственных enumerable-свойств, поэтому сериализуются только пустые объекты. Данные теряются молча. В проекте `serializeTasks` превращает `Set` в `{ __type: 'Set', values: [...] }`, а `Map` — в `{ __type: 'Map', entries: [...] }`.

</details>

## 4. Повреждённый JSON в хранилище

Что выведет код?

```js
const storage = {
  getItem: () => '{broken',
  setItem() {},
  removeItem() {},
};

const store = createStorage('tasks', { storage, defaultValue: [] });
console.log(store.load());
```

<details>
<summary>Ответ</summary>

```
[]
```

`createStorage.load()` оборачивает `JSON.parse` в `try/catch`. Битый JSON — штатная ситуация (старая версия, ручная правка), приложение не должно падать на старте. Поэтому возвращается `defaultValue`, то есть `[]`.

</details>

## 5. Миграция v2 → v3

Что выведет код?

```js
const result = migrate({
  version: 2,
  tasks: [
    {
      id: 't1',
      createdAt: '2026-01-01T00:00:00.000Z',
      dueDate: Date.UTC(2026, 11, 1),
      tags: ['Work', ' work ', 'HOME', ''],
    },
  ],
});

console.log(result.version);
console.log(result.tasks[0].tags);
console.log(result.tasks[0].dueDate, result.tasks[0].updatedAt);
```

<details>
<summary>Ответ</summary>

```
3
[ 'work', 'home' ]
2026-12-01 2026-01-01T00:00:00.000Z
```

`migrate` применяет шаг v2 → v3: timestamp `dueDate` превращается в `'YYYY-MM-DD'`, теги нормализуются (`trim`, lowercase, без пустых и дублей), а `updatedAt` берётся из `updatedAt ?? createdAt ?? now`. Вход не мутируется, результат идемпотентен.

</details>

## 6. Циклическая ссылка

Что выведет код?

```js
const data = { id: 1 };
data.self = data;

try {
  serializeTasks(data);
} catch (error) {
  console.log(error.message);
  console.log(error.cause.name);
}
```

<details>
<summary>Ответ</summary>

```
Cannot serialize data: circular reference
TypeError
```

`JSON.stringify` не умеет циклы и бросает `TypeError: Converting circular structure to JSON`. `serializeTasks` перехватывает именно эту ошибку и бросает новую с понятным сообщением, сохраняя исходный `TypeError` в `error.cause`. В `createStorage.save` такая ошибка не пробрасывается наружу — `save` вернёт `false`.

</details>

## 7. Маркеры `Date` и `Set`

Что выведет код?

```js
const json = serializeTasks({
  tags: new Set(['work']),
  when: new Date(0),
});

console.log(json);
const restored = deserializeTasks(json);
console.log(restored.tags instanceof Set, restored.when instanceof Date);
```

<details>
<summary>Ответ</summary>

```
{"tags":{"__type":"Set","values":["work"]},"when":{"__type":"Date","value":"1970-01-01T00:00:00.000Z"}}
true true
```

`replacer` получает `Date` уже как строку (сработал `toJSON`), поэтому исходное значение берётся через `this[key]`. Для `Set` сохраняются элементы, для `Map` — пары `entries`. `reviver` в `deserializeTasks` идёт снизу вверх и заменяет объекты с `__type` на настоящие `Date`, `Set`, `Map`.

</details>
