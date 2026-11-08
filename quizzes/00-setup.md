# Квиз 00 · Старт и инструменты

Сначала запишите прогноз, затем запустите код в Node или DevTools и сверьтесь с ответом.

## 1. Глобальные объекты в Node

```js
// Node.js REPL
console.log(typeof window);
console.log(typeof globalThis);
```

<details>
<summary>Ответ</summary>

`undefined`, затем `'object'`.

В Node нет DOM-объекта `window`, поэтому `typeof window` безопасно даёт `'undefined'`. Глобальный объект Node доступен как `globalThis`; в браузере `globalThis === window`. Именно поэтому код с `window` или `document` нельзя без изменений запускать в Node-тестах.
</details>

## 2. Браузер и CommonJS

```js
// DevTools Console на странице, которую отдал Vite
console.log(typeof document);
console.log(typeof require);
```

<details>
<summary>Ответ</summary>

`'object'`, затем `'undefined'`.

В браузере есть `document`, но нет CommonJS-функции `require`: проект использует ES-модули (`import`/`export`). В Node при `"type": "module"` `require` тоже недоступен в обычном модуле; для динамической загрузки применяют `import()`.
</details>

## 3. Сложение в REPL

```js
console.log('TaskFlow' + 1 + 2);
console.log(1 + 2 + 'TaskFlow');
```

<details>
<summary>Ответ</summary>

`TaskFlow12` и `3TaskFlow`.

Оператор `+` вычисляется слева направо. Если хотя бы один операнд — строка, происходит конкатенация. В первом случае сначала `'TaskFlow' + 1` даёт строку, затем к ней приклеивается `2`. Во втором сначала складываются числа `1 + 2`, и только потом результат становится строкой.
</details>

## 4. package.json без type module

```js
// package.json без поля "type": "module"
// src/playground/hello.js
export function greet(name) {
  return `Привет, ${name}!`;
}
```

Что произойдёт при `node src/playground/hello.js`?

<details>
<summary>Ответ</summary>

Node завершится с `SyntaxError: Unexpected token 'export'`.

Без `"type": "module"` Node считает `.js` файл CommonJS и не понимает `export`. Vite при этом умеет обрабатывать ESM независимо от режима Node, но прямой запуск файла через `node` требует `"type": "module"` (или расширения `.mjs`).
</details>

## 5. Console: группа и ошибка

```js
console.group('TaskFlow');
console.log('модуль 0');
console.groupEnd();
console.error('TODO: greet');
```

<details>
<summary>Ответ</summary>

В Console появится сворачиваемая группа `TaskFlow` с вложенной строкой `модуль 0`, а затем красное сообщение `TODO: greet`.

`console.error` только помечает сообщение как ошибку — исключение не бросается, выполнение продолжается. `console.groupEnd()` закрывает группу. Похожим образом `console.time('load')`/`console.timeEnd('load')` измеряют время между вызовами, а `console.table` показывает массив объектов таблицей.
</details>

## 6. Открыли index.html напрямую

```js
// страница открыта как file:///C:/.../index.html
fetch('/src/main.js')
  .then((response) => console.log(response.status))
  .catch((error) => console.error(error.name));
```

<details>
<summary>Ответ</summary>

Сработает `catch` и выведет `TypeError` (в браузере сообщение обычно `Failed to fetch`).

По протоколу `file://` у страницы особый origin, и браузер блокирует `fetch` и загрузку ES-модулей. Поэтому приложение запускают через `npm run dev` — Vite отдаёт файлы по `http://localhost:5173`, и запросы работают.
</details>

## 7. Первый запуск тестов

```js
// tests/m00/smoke.test.js (фрагмент)
it('greet returns a string containing the name', () => {
  const result = greet('Ада');
  expect(typeof result).toBe('string');
});
```

Что покажет `npm test` до реализации `greet`?

<details>
<summary>Ответ</summary>

Один тест упадёт с `Error: TODO 0.1: not implemented`, второй (проверка версии Node) пройдёт: будет примерно `1 failed, 1 passed`.

Это нормальное состояние старта: тесты специально падают на заглушке, а не на синтаксической ошибке или неверном импорте. После реализации `greet` оба теста становятся зелёными.
</details>
