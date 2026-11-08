# Квиз 07 · Асинхронность

> 7 вопросов: сначала предскажите вывод и объясните его, затем откройте ответ.
> Проверить себя можно тестами модуля: `npx vitest run tests/m07`.

## 1. Порядок в event loop

Что выведет код и почему?

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve()
  .then(() => console.log('C'))
  .then(() => console.log('D'));
queueMicrotask(() => console.log('E'));
console.log('F');
```

<details>
<summary>Ответ</summary>

```
A
F
C
E
D
B
```

Сначала выполняется весь синхронный код (`A`, `F`). Затем очередь микрозадач: `C`, поставленная через `then`, и `E` из `queueMicrotask`. Продолжение `D` попадает в очередь только после выполнения `C`, поэтому идёт после `E`. `setTimeout` — макрозадача, она последняя.

</details>

## 2. `await` для готового значения

Что выведет код и почему?

```js
async function foo() {
  console.log('1');
  await null;
  console.log('2');
}

console.log('3');
foo();
console.log('4');
```

<details>
<summary>Ответ</summary>

```
3
1
4
2
```

Тело `foo` выполняется синхронно до первого `await`: печатается `1`. `await null` всегда приостанавливает функцию, даже если значение уже готово, — продолжение уходит в микрозадачи. Поэтому сначала печатается синхронный `4`, затем `2`.

</details>

## 3. `allSettled` вместо `all`

Что выведет код? Что изменилось бы с `Promise.all`?

```js
const results = await Promise.allSettled([
  Promise.resolve('ok'),
  Promise.reject(new Error('fail')),
]);

console.log(results.map((result) => result.status));
console.log(results[1].reason.message);
```

<details>
<summary>Ответ</summary>

```
[ 'fulfilled', 'rejected' ]
fail
```

`Promise.allSettled` ждёт завершения всех промисов и возвращает объекты `{ status, value }` или `{ status, reason }`. `Promise.all` в этом же коде сразу отклонился бы с `Error('fail')`, и результат успешного промиса потерялся бы — именно поэтому `loadInitialData` использует `allSettled`.

</details>

## 4. `Promise.race` и отмена

Что выведет код? Отменяется ли проигравший промис?

```js
const slow = new Promise((resolve) => setTimeout(() => resolve('slow'), 100));
const fast = new Promise((resolve) => setTimeout(() => resolve('fast'), 10));

console.log(await Promise.race([slow, fast]));
```

<details>
<summary>Ответ</summary>

```
fast
```

`race` отдаёт результат первого завершившегося промиса. Проигравший `slow` **не отменяется**: его таймер продолжит работу. `withTimeout` устроен так же, но дополнительно очищает свой таймер в `finally`; для реальной отмены запроса нужен `AbortController`.

</details>

## 5. `forEach` и `await`

Что выведет код сразу после запуска и что будет через 20 мс?

```js
const log = [];
[1, 2, 3].forEach(async (n) => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  log.push(n);
});

console.log(log.length);
```

<details>
<summary>Ответ</summary>

Сразу:

```
0
```

Через 20 мс:

```
[1, 2, 3]
```

`forEach` не ждёт промисы, которые возвращают колбэки: он просто запускает все три функции. Каждая приостанавливается на `await`, поэтому синхронный `console.log` видит пустой массив. Для ожидания используйте `mapAsync` (`Promise.all`) или `eachSeries` (`for...of` + `await`).

</details>

## 6. Сколько попыток делает `retry`?

Что выведет код и почему?

```js
let calls = 0;
const fn = async () => {
  calls += 1;
  if (calls < 3) throw new Error('fail');
  return 'ok';
};

const result = await retry(fn, { retries: 2, delayMs: 1, factor: 2 });
console.log(result, calls);
```

<details>
<summary>Ответ</summary>

```
ok 3
```

`retries` — число повторов **после** первой попытки, поэтому всего попыток `retries + 1 = 3`. Паузы растут экспоненциально: `1 мс`, затем `2 мс` (`delayMs * factor ** attempt`). Третья попытка успешна, `retry` возвращает `'ok'`.

</details>

## 7. Отмена запроса

Что выведет код? Почему `AbortError` не превращается в `NetworkError`?

```js
const controller = new AbortController();
const promise = request('/api/tasks', { signal: controller.signal });
controller.abort();

try {
  await promise;
} catch (error) {
  console.log(error.name);
}
```

<details>
<summary>Ответ</summary>

```
AbortError
```

`request` получает отменённый `signal`, `fakeFetch`/`fetch` отклоняет промис с `DOMException` по имени `AbortError`. В `client.js` эта ошибка пробрасывается **как есть**, до обёртки в `NetworkError`, чтобы вызывающий код мог отличить отмену от сбоя сети. `createLiveSearch` именно поэтому игнорирует `AbortError` и не показывает его пользователю.

</details>
