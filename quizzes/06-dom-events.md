# Квиз 06 · DOM и события

> 8 вопросов: порядок событий, делегирование, `dataset`, формы и XSS.
> Тесты модуля: `npx vitest run tests/m06`.

## 1. Порядок фаз события

```js
const outer = document.createElement('div');
const inner = document.createElement('button');
outer.append(inner);

const log = [];
outer.addEventListener('click', () => log.push('outer-capture'), true);
inner.addEventListener('click', () => log.push('inner'));
outer.addEventListener('click', () => log.push('outer-bubble'));

inner.click();
console.log(log);
```

<details><summary>Ответ</summary>

```text
[ 'outer-capture', 'inner', 'outer-bubble' ]
```

Событие проходит три фазы: перехват (capture) от корня вниз, цель (target), всплытие (bubble) обратно вверх.
Третий аргумент `true` (или `{ capture: true }`) регистрирует обработчик на фазе перехвата, поэтому
`outer-capture` срабатывает раньше обработчика на самой кнопке. Затем событие всплывает и вызывает
`outer-bubble`.

Если бы оба обработчика на `outer` были без `capture`, они сработали бы после `inner` в порядке регистрации:
`inner`, `outer-capture`, `outer-bubble`.

</details>

## 2. `stopPropagation` не отменяет действие

```js
const outer = document.createElement('div');
const inner = document.createElement('button');
outer.append(inner);

outer.addEventListener('click', () => console.log('outer'));
inner.addEventListener('click', (event) => {
  event.stopPropagation();
  console.log('inner, defaultPrevented =', event.defaultPrevented);
});

inner.click();
```

<details><summary>Ответ</summary>

```text
inner, defaultPrevented = false
```

`stopPropagation()` останавливает движение события по дереву, поэтому обработчик на `outer` не вызывается.
Но действие браузера по умолчанию не отменяется: `defaultPrevented` остаётся `false`. Для отмены нужно
вызвать `event.preventDefault()` (например, чтобы форма не перезагружала страницу).

`stopImmediatePropagation()` дополнительно не даёт сработать другим обработчикам на том же элементе.

</details>

## 3. Делегирование и `closest`

```js
const list = document.createElement('ul');
list.innerHTML = `
  <li data-id="1"><button data-action="delete"><span>×</span></button></li>
  <li data-id="2"><button data-action="delete"><span>×</span></button></li>
`;

list.addEventListener('click', (event) => {
  const actionEl = event.target.closest('[data-action]');
  if (!actionEl) return;
  const item = actionEl.closest('[data-id]');
  console.log(actionEl.dataset.action, item.dataset.id);
});

list.querySelector('li[data-id="2"] span').click();
```

<details><summary>Ответ</summary>

```text
delete 2
```

Клик приходит на вложенный `<span>`, поэтому `event.target` — это `span`, а не кнопка. `closest('[data-action]')`
поднимается по предкам до `<button>` и находит `data-action="delete"`. Второй `closest('[data-id]')` находит
`<li>` с `data-id="2"`. Значения `dataset` — строки.

Один слушатель на `list` работает для всех текущих и будущих карточек: после перерисовки не нужно
заново вешать обработчики. `innerHTML` здесь безопасен только потому, что разметка статична; данные
пользователя так вставлять нельзя.

</details>

## 4. `innerHTML` против `textContent`

```js
const container = document.createElement('div');
const payload = '<img src=x onerror="window.hacked = true">';

const unsafe = document.createElement('p');
unsafe.className = 'xss';
unsafe.innerHTML = payload;

const safe = document.createElement('p');
safe.textContent = payload;

container.append(unsafe, safe);

console.log(container.querySelectorAll('img').length);
console.log(unsafe.textContent === '');
console.log(safe.textContent === payload);
```

<details><summary>Ответ</summary>

```text
1
true
true
```

`innerHTML` разбирает строку как HTML и создаёт настоящий `<img>`. В браузере `src=x` не загрузится,
сработает `onerror`, и код из атрибута выполнится — это XSS. `unsafe.textContent` при этом пустой:
у `<img>` нет текстового содержимого.

`textContent` не парсит разметку: строка остаётся текстом, поэтому `safe.textContent === payload`.
В `TaskFlow` заголовки, описания, теги и сообщения toast выводятся только через текст.

</details>

## 5. `target`, `currentTarget` и `this`

```js
const outer = document.createElement('div');
const inner = document.createElement('span');
outer.append(inner);

outer.addEventListener('click', function (event) {
  console.log(event.target === inner);
  console.log(event.currentTarget === outer);
  console.log(this === outer);
});

inner.click();
```

<details><summary>Ответ</summary>

```text
true
true
true
```

`event.target` — элемент, на котором возникло событие, то есть `inner`.
`event.currentTarget` — элемент, к которому прикреплён текущий обработчик, то есть `outer`.
В обычной функции `this` равен `currentTarget`; в стрелке своего `this` нет, и понадобился бы
`event.currentTarget`.

В делегировании опирайтесь на `closest`/`currentTarget`, а не на `target`: `target` может быть
любым вложенным элементом.

</details>

## 6. `{ once }` и удаление обработчика

```js
const button = document.createElement('button');
let calls = 0;
const handler = () => {
  calls += 1;
};

button.addEventListener('click', handler, { once: true });
button.click();
button.click();
console.log(calls);

button.addEventListener('click', handler);
button.removeEventListener('click', handler);
button.click();
console.log(calls);
```

<details><summary>Ответ</summary>

```text
1
1
```

`{ once: true }` автоматически удаляет обработчик после первого вызова, поэтому второй `click()` ничего
не меняет. Затем обработчик добавляется снова и сразу удаляется через `removeEventListener`. Для удаления
нужна **та же ссылка** на функцию: если добавить `handler.bind(button)`, а удалять другой `bind`, ничего
не удалится — это разные функции.

</details>

## 7. `dataset`

```js
const card = document.createElement('article');
card.dataset.taskId = '42';
card.dataset.status = 'in-progress';

console.log(card.getAttribute('data-task-id'));
console.log(card.dataset.taskId);
console.log(typeof card.dataset.status);
```

<details><summary>Ответ</summary>

```text
42
42
string
```

`dataset.taskId` соответствует атрибуту `data-task-id`: camelCase в JS, kebab-case в HTML. Обратное
преобразование тоже работает. Все значения `dataset` — строки, даже если присвоить число: `dataset.id = 42`
даст `"42"`. Для составных данных лучше использовать отдельные `data-*` или JSON-атрибут.

`dataset` удобен для делегирования: `data-action`, `data-id`, `data-status` читаются через
`event.target.closest('[data-action]').dataset`.

</details>

## 8. `FormData` отдаёт сырые строки

```js
const form = document.createElement('form');
const title = document.createElement('input');
title.name = 'title';
title.value = '  Task  ';
const tags = document.createElement('input');
tags.name = 'tags';
tags.value = 'work, home, work';
form.append(title, tags);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  console.log(JSON.stringify([...data.entries()]));
  console.log(event.defaultPrevented);
});

form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
```

<details><summary>Ответ</summary>

```text
[["title","  Task  "],["tags","work, home, work"]]
true
```

`new FormData(form)` собирает поля по атрибуту `name` и возвращает значения **как есть**: без `trim`,
разделения тегов и проверки дат. `TaskForm` сам нормализует данные: обрезает `title`, режет `tags`
по запятой и удаляет дубли, пустой `dueDate` превращает в `null`.

`event.preventDefault()` отменяет стандартную отправку формы; `defaultPrevented` становится `true`.
Без этого браузер перезагрузил бы страницу, а тест не получил бы управляемый `onSubmit`.

</details>
