# Квиз 11. Качество и типизация

1. Что покажет `npm run typecheck` и почему?

```js
// jsconfig.json: { "compilerOptions": { "allowJs": true, "checkJs": false, "noEmit": true } }

/** @param {number} n @returns {string} */
export function double(n) {
  return n * 2;
}
```

<details><summary>Ответ</summary>

Команда завершится без ошибок: `checkJs: false` означает, что `tsc` не проверяет JS-файлы, несмотря на `allowJs: true`. JSDoc-аннотации игнорируются. Нужно вручную поставить `"checkJs": true` в `jsconfig.json` или добавить `// @ts-check` в начало файла — тогда `tsc` сообщит, что `number` нельзя вернуть как `string`.

</details>

2. Что скажет `tsc` при включённом `checkJs` и как исправить код?

```js
/** @param {string} title @returns {number} */
export function titleLength(title) {
  return title;
}
```

<details><summary>Ответ</summary>

Ошибка: `Type 'string' is not assignable to type 'number'` — функция обещает `number`, но возвращает `string`. Исправление зависит от смысла: либо `return title.length`, либо изменить JSDoc на `@returns {string}`. Это аналог `FIXME(11.4.1)` в `src/playground/typeErrors.js`: типы должны соответствовать и аннотации, и реализации.

</details>

3. Что выведет `tsc` и почему?

```js
// @ts-check
/** @typedef {'low'|'medium'|'high'} Priority */

/** @param {Priority} priority @returns {number} */
function priorityWeight(priority) {
  return { low: 1, medium: 2, high: 3 }[priority];
}

priorityWeight('urgent');
```

<details><summary>Ответ</summary>

Ошибка: `Argument of type '"urgent"' is not assignable to parameter of type 'Priority'`. `@typedef` создаёт литеральный union-тип, поэтому допустимы только `'low'`, `'medium'`, `'high'`. В рантайме `priorityWeight('urgent')` вернул бы `undefined`, но `tsc` ловит это ещё до запуска. Это главный смысл JSDoc-типизации как моста к TypeScript.

</details>

4. Что произойдёт при вызове и почему?

```js
function createCounterBug() {
  const state = { count: 0 };
  return {
    state,
    increment() {
      this.state.count += 1;
    },
  };
}

const counter = createCounterBug();
const { increment } = counter;
increment();
console.log(counter.state.count);
```

<details><summary>Ответ</summary>

Будет брошен `TypeError: Cannot read properties of undefined (reading 'state')`: метод `increment` оторван от объекта, а в strict mode (ES-модули всегда strict) `this` равен `undefined`. Строка `console.log` не выполнится. Исправление — замыкание или стрелка: `increment: () => { state.count += 1; }`, либо заранее создать функцию и вернуть её как `increment` (при необходимости с `bind` к объекту, содержащему `state`). Это баг 11.2 из `lostThisBug.js`.

</details>

5. Что выведет код и почему?

```js
const original = { id: 't1', tags: ['work'] };

function addTagToTask(task, tag) {
  task.tags.push(tag);
  return task;
}

const updated = addTagToTask(original, 'home');
console.log(original.tags, updated === original);
```

<details><summary>Ответ</summary>

```text
[ 'work', 'home' ] true
```

`push` мутирует массив внутри исходного объекта, а возвращается тот же `task`. Поэтому `original` уже содержит `home`, и `updated` — та же ссылка. Правильная иммутабельная версия: `return { ...task, tags: [...task.tags, tag] }`; тогда `original.tags` останется `['work']`, а `updated !== original`. Это баг 11.1 из `mutationBug.js`.

</details>

6. Что окажется в `shown` и почему?

```js
function createSearchBug(fetchFn, onResult) {
  return async (query) => {
    const result = await fetchFn(query);
    onResult(result, query);
  };
}

const resolvers = new Map();
const fetchFn = (query) => new Promise((resolve) => resolvers.set(query, resolve));
const shown = [];
const search = createSearchBug(fetchFn, (result, query) => shown.push(`${query}:${result}`));

const first = search('a');
const second = search('b');
resolvers.get('b')('B');
await second;
resolvers.get('a')('A');
await first;
console.log(shown);
```

<details><summary>Ответ</summary>

```text
[ 'b:B', 'a:A' ]
```

Запрос `a` стартовал раньше, но ответил позже. `createSearchBug` не проверяет актуальность, поэтому `onResult` для `a` вызывается последним и перезаписывает результат `b`. В UI это выглядит как «ввели `a`, а показались результаты `ab`». Исправление — sequence id: `let latest = 0; const id = ++latest; ... if (id === latest) onResult(result, query)`. Это баг 11.3 из `raceBug.js`.

</details>

7. Что покажет `npm run lint` и исправит ли проблему `npm run format`?

```js
var count = 0;
if (count == 0) {
  console.log('zero');
}
```

<details><summary>Ответ</summary>

`npm run lint` (ESLint) сообщит как минимум две ошибки: `no-var` для `var` и `eqeqeq` для `==`; также может быть предупреждение `prefer-const`, ведь `count` не переприсваивается. `npm run format` запускает Prettier — он выровняет пробелы и кавычки, но не заменит `var` на `let/const` и `==` на `===`. Исправлять нужно код: `const count = 0; if (count === 0) ...`; часть правил ESLint умеет чинить через `npx eslint . --fix`, но не `eqeqeq` по смыслу.

</details>

8. Что выведет код и почему?

```js
async function load() {
  throw new Error('boom');
}

try {
  load();
  console.log('after');
} catch (error) {
  console.log('caught');
}
```

<details><summary>Ответ</summary>

Сначала выведется `after`, затем появится unhandled rejection с ошибкой `boom` (в Node процесс может завершиться с ненулевым кодом). `async`-функция никогда не бросает синхронно: она возвращает отклонённый Promise. `try/catch` без `await` этот reject не ловит. Нужно `await load()` внутри `try` в `async`-контексте или `.catch(...)`. Это типичная ловушка при отладке асинхронного кода.

</details>
