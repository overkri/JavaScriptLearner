# Квиз 02 · Функции и замыкания

Сначала запишите прогноз, затем проверьте его в Node или Console. Примеры используют те же идеи, что `id.js`, `functional.js`, `closureQuiz.js` и `thisArrowQuiz.js`.

## 1. Два независимых счётчика

```js
function createIdGenerator(prefix = 'task') {
  let counter = 0;
  return () => `${prefix}-${(counter += 1)}`;
}

const taskId = createIdGenerator();
const noteId = createIdGenerator('note');
console.log(taskId(), taskId(), noteId(), taskId());
```

<details>
<summary>Ответ</summary>

`task-1 task-2 note-1 task-3`.

Каждый вызов `createIdGenerator` создаёт новое замыкание со своим `counter`. Переменная недоступна снаружи, поэтому счётчики не пересекаются. Это та же идея, что в упражнении `createIdGenerator` из `src/utils/id.js`.
</details>

## 2. Цикл с var

```js
const fns = [];
for (var i = 0; i < 3; i += 1) {
  fns.push(() => i);
}
console.log(fns.map((fn) => fn()));
```

<details>
<summary>Ответ</summary>

`[3, 3, 3]`.

`var` создаёт одну переменную на всю функцию, а не новую на каждую итерацию. К моменту вызова функций цикл закончился, и `i` равно `3`. Все стрелки замкнуты на одну и ту же привязку.
</details>

## 3. Цикл с let

```js
const fns = [];
for (let i = 0; i < 3; i += 1) {
  fns.push(() => i);
}
console.log(fns.map((fn) => fn()));
```

<details>
<summary>Ответ</summary>

`[0, 1, 2]`.

`let` в заголовке `for` создаёт новую привязку на каждой итерации, и каждая стрелка захватывает свою. Это один из способов исправить классическую проблему с `setTimeout`: `fixLoopWithLet()` в `closureQuiz.js` возвращает именно `[0, 1, 2]`.
</details>

## 4. this в стрелке и обычной функции

```js
const obj = {
  name: 'TaskFlow',
  arrowInsideMethod() {
    const arrow = () => this.name;
    return arrow();
  },
  regularInsideMethod() {
    function regular() {
      return this?.name;
    }
    return regular();
  },
};

console.log(obj.arrowInsideMethod());
console.log(obj.regularInsideMethod());
```

<details>
<summary>Ответ</summary>

`'TaskFlow'`, затем `undefined`.

Стрелка не имеет своего `this` и берёт `this` метода `arrowInsideMethod`, то есть `obj`. Обычная `regular()` вызывается без объекта, поэтому в strict mode (ES-модули всегда strict) её `this` — `undefined`; `this?.name` даёт `undefined`. Если бы `regular` вызывалась как `obj.regular()`, она увидела бы `obj`.
</details>

## 5. arguments и new у стрелки

```js
function outer(a, b) {
  const inner = () => arguments.length;
  return inner();
}
console.log(outer(1, 2, 3));

try {
  new (() => {})();
} catch (error) {
  console.log(error.name);
}
```

<details>
<summary>Ответ</summary>

`3`, затем `TypeError`.

У стрелки нет собственного `arguments`: `inner` видит `arguments` внешней функции `outer`, куда передали три аргумента. Стрелки также не являются конструкторами — у них нет `prototype`, поэтому `new` бросает `TypeError`.
</details>

## 6. debounce и таймеры

```js
// debounce из src/utils/functional.js
const log = debounce((value) => console.log(value), 100);
log(1);
setTimeout(() => log(2), 50);
setTimeout(() => log(3), 120);
```

<details>
<summary>Ответ</summary>

Будет выведено только `3`, примерно через 220 мс после старта.

`debounce` — trailing edge: каждый новый вызов сбрасывает предыдущий таймер. Вызов `1` планирует срабатывание на 100 мс, вызов `2` на 50 мс отменяет его и планирует на 150 мс, вызов `3` на 120 мс снова отменяет и планирует на 220 мс. В итоге выполняется только последний вызов.
</details>

## 7. memoize

```js
// memoize из src/utils/functional.js
let calls = 0;
const double = memoize((value) => {
  calls += 1;
  return value * 2;
});

console.log(double(2), double(2), double(3), calls);
```

<details>
<summary>Ответ</summary>

`4 4 6 2`.

По умолчанию ключ строится через `JSON.stringify` от аргументов: `[2]` и `[3]` дают разные ключи, а повторный `double(2)` берёт значение из кэша. Функция вызвана дважды, а не трижды. Метод `clear()` очищает кэш.
</details>

## 8. curry и pipe

```js
const add = curry((a, b, c) => a + b + c);
const transform = pipe(
  (value) => value + 1,
  (value) => value * 2,
);

console.log(add(1)(2)(3));
console.log(add(1, 2)(3));
console.log(transform(3));
```

<details>
<summary>Ответ</summary>

`6`, `6`, `8`.

`curry` накапливает аргументы, пока их количество не достигнет `fn.length` (у функции три параметра), поэтому обе формы вызова работают. `pipe` применяет функции слева направо: `3 + 1 = 4`, затем `4 * 2 = 8`. `compose` сделал бы то же в обратном порядке.
</details>
