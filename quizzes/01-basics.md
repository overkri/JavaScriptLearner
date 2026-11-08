# Квиз 01 · Основы языка

Сначала запишите прогноз, затем проверьте его в `node` или Console. Все примеры — реальные ловушки из `typesQuiz`, `scopeQuiz` и упражнений модуля 1.

## 1. typeof

```js
console.log(typeof null);
console.log(typeof NaN);
console.log(typeof (() => {}));
console.log(typeof undeclaredVariable);
```

<details>
<summary>Ответ</summary>

`'object'`, `'number'`, `'function'`, `'undefined'`.

`typeof null` — историческая ошибка языка: `null` надо проверять через `value === null`. `NaN` — числовое значение, поэтому `'number'`. Стрелка имеет тип `'function'`. `typeof` на необъявленной переменной не бросает ошибку и возвращает `'undefined'` (обычное чтение такой переменной дало бы `ReferenceError`).
</details>

## 2. Плавающая точка

```js
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);
console.log(Number((0.1 + 0.2).toFixed(2)));
```

<details>
<summary>Ответ</summary>

`0.30000000000000004`, `false`, `0.3`.

Все числа в JS — двоичные double, и `0.1`/`0.2` не представимы точно. `toFixed(2)` возвращает строку, `Number(...)` превращает её обратно в число. Для сравнения дробей используют эпсилон или целые единицы.
</details>

## 3. Приведение типов

```js
console.log('5' - 2);
console.log('5' + 2);
console.log('5' * '2');
console.log(true + 1);
```

<details>
<summary>Ответ</summary>

`3`, `'52'`, `10`, `2`.

`-`, `*`, `/` приводят операнды к числу. `+` при строке с любой стороны выполняет конкатенацию, а `true` в арифметике становится `1`. Отсюда классическая ошибка: `'5' + 2` — не `7`.
</details>

## 4. NaN и null

```js
console.log(NaN === NaN);
console.log(Number.isNaN(NaN));
console.log(null == undefined);
console.log(null === undefined);
console.log(null == 0);
console.log(null >= 0);
```

<details>
<summary>Ответ</summary>

`false`, `true`, `true`, `false`, `false`, `true`.

`NaN` не равен даже самому себе; проверяйте через `Number.isNaN`. Нестрогое `==` считает `null` и `undefined` равными только друг другу, поэтому `null == 0` — `false`. Но оператор `>=` приводит `null` к числу `0`, поэтому `null >= 0` — `true`. Это ещё один довод использовать `===`.
</details>

## 5. Truthy и falsy

```js
console.log(Boolean('0'), Boolean(''));
console.log(Boolean(0), Boolean(' '));
console.log(Boolean([]), Boolean({}));
```

<details>
<summary>Ответ</summary>

`true false`, `false true`, `true true`.

Falsy только `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`. Непустые строки `'0'` и `' '` — truthy, массивы и объекты — тоже. Поэтому `isNonEmptyString(' ')` должен возвращать `false` через `trim()`, хотя `Boolean(' ')` равно `true`.
</details>

## 6. ?? против ||

```js
const task = { title: 'Купить молоко', priority: '', dueDate: null };

console.log(task.priority ?? 'medium');
console.log(task.priority || 'medium');
console.log(task.dueDate ?? 'без срока');
console.log(task.missing?.length ?? 0);
```

<details>
<summary>Ответ</summary>

`''`, `'medium'`, `'без срока'`, `0`.

`??` подставляет значение только для `null`/`undefined`, поэтому пустая строка сохраняется. `||` реагирует на любое falsy-значение и заменяет `''`. `task.missing?.length` даёт `undefined`, затем `?? 0` — `0`. Смешивать `??` с `||` без скобок нельзя: `a ?? b || c` — синтаксическая ошибка.
</details>

## 7. Hoisting, блок и TDZ

```js
console.log(typeof x);
var x = 1;
{
  let x = 2;
  console.log(x);
}
console.log(x);
console.log(y);
let y = 3;
```

<details>
<summary>Ответ</summary>

`'undefined'`, `2`, `1`, затем `ReferenceError`.

`var x` поднимается, но до присваивания равна `undefined`. `let x` внутри блока — другая переменная, она не меняет внешнюю. Последний `console.log(y)` обращается к `let y` до инициализации — это TDZ, поэтому выполнение прерывается с `ReferenceError: Cannot access 'y' before initialization`.
</details>

## 8. Сортировка по умолчанию

```js
const numbers = [10, 9, 1];
const sorted = numbers.sort();
console.log(sorted);
console.log(numbers);
console.log(sorted === numbers);
```

<details>
<summary>Ответ</summary>

`[1, 10, 9]`, `[1, 10, 9]`, `true`.

`sort()` без компаратора приводит элементы к строкам и сравнивает лексикографически: `'10'` идёт раньше `'9'`. Метод мутирует исходный массив и возвращает ту же ссылку. Для чисел нужен `numbers.toSorted((a, b) => a - b)` → `[1, 9, 10]`.
</details>
