# Квиз 05 · ES-модули

> 7 вопросов: CommonJS vs ESM, named/default, циклы, динамический `import()`, TLA и пути.
> Тесты модуля: `npx vitest run tests/m05`.

## 1. `require` в ES-модуле

```js
// package.json
// { "type": "module" }

// main.js
const fs = require('node:fs');
console.log(typeof fs.readFileSync);
```

<details><summary>Ответ</summary>

Будет выброшено `ReferenceError: require is not defined in ES module scope`.

Поле `"type": "module"` делает все `.js`-файлы ES-модулями. В них нет `require`, `module.exports`,
`__dirname` и `__filename`. Правильный вариант:

```js
import fs from 'node:fs';
console.log(typeof fs.readFileSync); // function
```

Если файл должен остаться CommonJS, его переименовывают в `.cjs` или добавляют отдельный `package.json`
с `"type": "commonjs"`.

</details>

## 2. Default — снимок, named — live binding

```js
// config.js
export let theme = 'light';
export function setTheme(value) {
  theme = value;
}
export default theme;

// main.js
import initialTheme, { theme, setTheme } from './config.js';
console.log(initialTheme, theme);
setTheme('dark');
console.log(initialTheme, theme);
```

<details><summary>Ответ</summary>

```text
light light
light dark
```

`export default theme` экспортирует **значение** переменной в момент выполнения модуля, поэтому
`initialTheme` навсегда остаётся `'light'`. Named-экспорт `theme` — live binding: импортёр видит
актуальное значение, и после `setTheme('dark')` оно становится `'dark'`.

Если нужен живой default, используют `export { theme as default }` — тогда default тоже будет привязан
к переменной. Присваивать импортированный `theme` напрямую нельзя: импорт доступен только для чтения.

</details>

## 3. Цикл и TDZ на верхнем уровне

```js
// a.js
import { b } from './b.js';
export const a = { name: 'a' };
export const label = `${a.name}->${b.name}`;

// b.js
import { a } from './a.js';
export const b = { name: 'b' };
export const back = `${b.name}<-${a.name}`;

// main.js
import { label } from './a.js';
console.log(label);
```

<details><summary>Ответ</summary>

Модуль не загрузится: `ReferenceError: Cannot access 'a' before initialization`.

При вычислении `a.js` сначала вычисляется зависимость `b.js`. В `b.js` строка `back` обращается к `a`,
но тело `a.js` ещё не выполнилось — binding `a` находится во временной мёртвой зоне (TDZ). `console.log(label)`
не выполнится вовсе.

Исправление — обращаться к соседу лениво, внутри функции:

```js
// a.js
import { b } from './b.js';
export const a = { name: 'a' };
export const describeCycle = () => `${a.name}->${b.name}`;
```

Функция вызывается после инициализации обоих модулей, поэтому TDZ уже не срабатывает.

</details>

## 4. Barrel: default и named — одна функция

```js
// domain/index.js
export { createTask as default, createTask } from './task.js';
export * from './taskOps.js';

// main.js
import createTask, { createTask as named, addTask } from './domain/index.js';
console.log(createTask === named, typeof addTask);
```

<details><summary>Ответ</summary>

```text
true function
```

`createTask as default` и `createTask` — два имени одного и того же binding'а, поэтому функции идентичны.
`export *` реэкспортирует именованные экспорты из `taskOps.js` (`addTask`, `removeTask`, ...), но **не**
реэкспортирует их default. Default в модуле может быть только один.

Barrel удобен, но внутри самого проекта лучше импортировать конкретный файл: так меньше риск
циклической зависимости и лишней загрузки.

</details>

## 5. Путь без расширения

```js
// Node.js, package.json: { "type": "module" }
// src/main.js
import { renderStatsPanel } from './features/stats/panel';
```

<details><summary>Ответ</summary>

В Node ESM — ошибка `ERR_MODULE_NOT_FOUND`: `Cannot find module .../features/stats/panel`.

Относительный импорт в ESM — это URL, а не поиск по classpath. Node не добавляет `.js` и не ищет
`index.js` в директории автоматически. Нужно:

```js
import { renderStatsPanel } from './features/stats/panel.js';
```

Vite часто разрешает импорт без расширения, но полагаться на это не стоит: нативный браузерный ESM
и Node так не умеют. В курсе все относительные пути пишутся с `.js`.

</details>

## 6. Кэширование динамического импорта

```js
// features/stats/index.js
let modulePromise;

export function loadStatsPanel() {
  modulePromise ??= import('./panel.js');
  return modulePromise;
}

// main.js
const first = loadStatsPanel();
const second = loadStatsPanel();
console.log(first === second);

first.then((panel) => console.log(panel.panelName));
```

<details><summary>Ответ</summary>

```text
true
stats-panel
```

`import('./panel.js')` возвращает `Promise` с namespace-объектом модуля. `??=` сохраняет промис при первом
вызове, поэтому `first` и `second` — одна и та же ссылка, а модуль загружается и вычисляется один раз.
`panelName` печатается позже, в микрозадаче `.then`.

Если кэшировать результат `await` (`let panel; panel ??= await import(...)`), два параллельных вызова
могут оба увидеть `undefined` и запустить загрузку дважды. Поэтому кэшируют именно промис.
`resetStatsPanel()` в проекте сбрасывает этот кэш для тестов.

</details>

## 7. Top-level await

```js
// a.js
console.log('a: start');
await Promise.resolve();
console.log('a: end');
export const value = 42;

// main.js
import { value } from './a.js';
console.log('main:', value);
```

<details><summary>Ответ</summary>

```text
a: start
a: end
main: 42
```

Top-level `await` разрешён в ESM и делает модуль асинхронным: импортёр `main.js` ждёт, пока `a.js`
полностью завершит вычисление. Поэтому `main:` печатается последним, хотя `value` объявлен после `await`.

Если бы `a.js` ждал таймер или сеть, вся цепочка импортёров тоже ждала бы. В циклической зависимости
TLA может привести к взаимной блокировке, поэтому тяжёлые асинхронные операции на верхнем уровне
общих модулей лучше не размещать.

</details>
