# Квиз 10. Продвинутые возможности

1. Что выведет этот код и почему?

```js
const parsed = parseQuery('tag:Work priority:high !done "buy milk" due:<2026-12-01');
console.log(parsed);
```

<details><summary>Ответ</summary>

```js
{
  tags: [ 'work' ],
  priority: 'high',
  status: null,
  excludeStatus: 'done',
  text: 'buy milk',
  dueBefore: '2026-12-01'
}
```

`parseQuery` сначала выделяет токены с учётом кавычек, затем разбирает `tag:`, `priority:`, `!status` и `due:` именованными группами. Тег `Work` приводится к `work`, кавычки сохраняют пробелы в `buy milk`, а `due:<2026-12-01` отбрасывает `<` и проверяет формат даты. `status` не задан, поэтому `null`.

</details>

2. Что выведет этот код и почему?

```js
const parsed = parseQuery('priority:urgent tag:Home milk');
console.log(parsed.priority, parsed.tags, parsed.text);
```

<details><summary>Ответ</summary>

```text
null [ 'home' ] priority:urgent milk
```

`urgent` не входит в допустимые `low|medium|high`, поэтому токен `priority:urgent` не становится фильтром и попадает в текст. Тег `Home` нормализуется в `home`, а `milk` — обычное слово. Текст собирается через пробел в исходном порядке.

</details>

3. Что выведет этот код и почему?

```js
const re = /tag:(\w+)/g;
console.log(re.test('tag:work'));
console.log(re.test('tag:work'));
console.log(re.lastIndex);
```

<details><summary>Ответ</summary>

```text
true
false
0
```

У регулярки с флагом `g` есть состояние — `lastIndex`. Первый `test` находит `tag:work` и оставляет `lastIndex = 8`. Второй `test` ищет с позиции 8, ничего не находит и сбрасывает `lastIndex` в `0`. Поэтому для перебора всех совпадений лучше использовать `matchAll`, а не переиспользовать `g`-regex с `test`.

</details>

4. Что выведет этот код и почему?

```js
for (const n of [1, 2, 5, 11, 21]) {
  console.log(pluralizeTasks(n));
}
```

<details><summary>Ответ</summary>

```text
1 задача
2 задачи
5 задач
11 задач
21 задача
```

`pluralizeTasks` вызывает `Intl.PluralRules('ru-RU').select(Math.abs(n))`: `1` → `one`, `2` → `few`, `5` → `many`, `11` → `many` (исключение для 11–14), `21` → `one` (21 % 10 === 1 и 21 % 100 !== 11). Затем категория отображается в слово «задача/задачи/задач».

</details>

5. Что выведет этот код и почему?

```js
const now = new Date(2026, 10, 8, 12, 0, 0);
console.log(formatRelative('2026-11-08', now));
console.log(formatRelative('2026-11-07', now));
console.log(formatRelative('2026-11-11', now));
```

<details><summary>Ответ</summary>

```text
сегодня
вчера
через 3 дня
```

`formatRelative` считает разницу именно в календарных днях (через `Date.UTC(year, month, date)`), а не в миллисекундах, и передаёт её в `Intl.RelativeTimeFormat(..., { numeric: 'auto' }).format(diff, 'day')`. Режим `numeric: 'auto'` даёт «сегодня» и «вчера» вместо «через 0 дней» и «1 день назад».

</details>

6. Что выведет этот код и почему?

```js
let pulled = 0;
function* naturals() {
  for (let i = 0; ; i += 1) {
    pulled += 1;
    yield i;
  }
}
const result = [...take(naturals(), 3)];
console.log(result, pulled);
```

<details><summary>Ответ</summary>

```text
[ 0, 1, 2 ] 3
```

`take` — генератор: он забирает ровно три значения и завершается через `return`. Spread доводит итератор до конца, `for...of` внутри `take` закрывает бесконечный `naturals` через `return()`, поэтому четвёртого `yield` не происходит. Массив `[...range(...)]` здесь не создаётся — вычисление ленивое.

</details>

7. Что выведет этот код и почему?

```js
const iterator = range(0, 5, 0);
console.log('created');
try {
  console.log([...iterator]);
} catch (error) {
  console.log(error.name);
}
```

<details><summary>Ответ</summary>

```text
created
RangeError
```

Тело генератора не выполняется при вызове `range(...)` — только при итерации. Поэтому `created` печатается до ошибки. При первом `next()` генератор видит `step === 0` и бросает `RangeError`; spread пробрасывает исключение, `catch` печатает имя ошибки. Тот же принцип работает для `paginate(items, 0)`.

</details>

8. Что выведет этот код и почему?

```js
const log = [];
const state = observable({ nested: { x: 1 }, items: [] }, (change) => {
  log.push(`${change.type}:${change.path.join('.')}`);
});

state.nested.x = 2;
state.nested.x = 2;
state.items.push('a');
console.log(log);
```

<details><summary>Ответ</summary>

```text
[ 'set:nested.x', 'set:items.0', 'set:items.length' ]
```

`state.nested` при чтении оборачивается в `Proxy` с путём `['nested']`, поэтому запись `x = 2` даёт путь `nested.x`. Вторая запись того же значения не уведомляет: `Object.is(2, 2)` истинно. `push` — это два изменения: индекс `0` и `length`; `observable` сообщает о каждом, потому что оба значения реально изменились.

</details>
