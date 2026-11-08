# 04 · `this`, прототипы, классы

> Модуль 4: упражнения `src/core/errors.js`, `src/core/EventEmitter.js`, `src/core/Store.js`,
> `src/domain/TaskList.js`, `src/playground/thisQuiz.js`, `src/playground/prototypeQuiz.js`.
>
> **Тесты модуля:** `npx vitest run tests/m04` · [папка тестов](../tests/m04)

## `this` определяется в месте вызова

- `obj.method()` — `this === obj`.
- `fn()` — в ESM/strict mode `this === undefined` (а не глобальный объект).
- `fn.call(ctx, ...args)` — явно задаёт `this` на один вызов; `fn.apply(ctx, args)` — то же, аргументы массивом.
- `fn.bind(ctx, ...args)` — возвращает **новую** функцию с навсегда привязанным `this` и частичными аргументами.
- `new Fn()` — `this` — только что созданный объект.
- Стрелка не имеет своего `this`: берёт его из окружающей области, не годится для `new`, у неё нет `arguments`.

Классическая потеря контекста:

```js
const fn = obj.getName;          // метод «оторван» от obj
fn();                            // this === undefined; обращение this.x → TypeError
button.addEventListener('click', obj.handler); // то же самое
```

Лечится через `obj.handler.bind(obj)`, стрелку-обёртку `() => obj.handler()` или `(event) => obj.handler(event)`.
В `thisQuiz.js` это `createBoundCounter()` (метод `increment` можно передать в колбэк) и `bindMethods(obj, ...names)`.

## Прототипы: наследование — это цепочка объектов

```text
dog → Dog.prototype → Animal.prototype → Object.prototype → null
```

- `Animal.prototype.speak` — метод живёт в прототипе, а не в каждом экземпляре.
- `Dog` вызывает родителя через `Animal.call(this, name)`.
- `inherit(Child, Parent)` делает `Child.prototype = Object.create(Parent.prototype)` и возвращает `constructor` через `Object.defineProperty`.
- `instanceof` идёт по цепочке прототипов; `Object.hasOwn(obj, key)` — только собственное свойство,
  `key in obj` — и собственное, и унаследованное (`hasOwnProp` / `hasProp` в `prototypeQuiz.js`).

## `class` — синтаксис над прототипами

- Методы класса попадают в `prototype` и не перечисляются в экземпляре; поля класса создаются на экземпляре.
- `get size()` — геттер, обращение как к свойству; `static from(initial)` — метод на самом конструкторе.
- `#listeners` в `EventEmitter` и `#tasks` в `TaskList` — настоящие приватные поля: снаружи не читаются,
  не видны в `Object.keys`, а обращение к чужому `#полю` даёт `TypeError` (brand check).
- Наследование: `class Store extends EventEmitter`, в конструкторе обязателен `super()`.
- В JS нет перегрузки методов, `interface`, `abstract`, как в Java; конструктор один.

## Иерархия ошибок

```text
Error → AppError → ValidationError / NotFoundError / NetworkError
```

`AppError` принимает `{ cause, code }`, `ValidationError` хранит `field` и `code: 'VALIDATION_ERROR'`,
`NetworkError` — `status` (по умолчанию `0`). В каждом подклассе явно задаётся `this.name`,
а `super(message, { cause })` сохраняет первопричину. `instanceof` работает на всех уровнях,
`stack` остаётся непустым.

## Как это используется в TaskFlow

- `EventEmitter`: `#listeners: Map<string, Set<Function>>`; `on` возвращает отписку, `once` срабатывает один раз,
  `emit` идёт по **копии** набора (отписка во время рассылки не ломает текущую) и ловит ошибки обработчиков.
- `Store extends EventEmitter`: `getState`, `setState(patch)` делает поверхностный иммутабельный merge,
  `subscribe(listener)` не вызывает слушателя сразу, `static from`, геттер `size`; при реальном изменении
  испускается `change(next, previous)`, при одинаковых значениях — нет.
- `TaskList`: `#tasks`, `add` возвращает `this`, `remove` — `boolean`, `[Symbol.iterator]` даёт `for...of` и spread,
  `toJSON` вызывается `JSON.stringify`, `static fromJSON` принимает строку, массив или `{ tasks }`.

## Java → JS

| Java | JavaScript |
|---|---|
| `this` всегда ссылается на экземпляр | `this` зависит от места вызова; метод можно «оторвать» |
| `class` — полноценный тип | `class` — сахар над прототипами, методов-перегрузок нет |
| `private` — модификатор доступа | `#field` — реальное сокрытие и brand check |
| `static` — член класса | `static` — свойство на функции-конструкторе |
| `interface`, `abstract`, перегрузки | отсутствуют; один конструктор, `super()` обязателен |
| `throw new ValidationException(...)` | `class ValidationError extends AppError`, `instanceof`, `cause` |

## Ловушки

1. **Потеря `this`.** `const fn = obj.method; fn()` — это не вызов метода. `this?.name` вернёт `undefined`,
   а `this.name` в strict mode бросит `TypeError`.
2. **`bind` создаёт новую функцию.** `emitter.off('x', handler.bind(this))` не отпишет исходный `handler`:
   ссылки разные. Храните результат `bind` в переменной.
3. **Стрелка как метод.** `read: () => this.title` читает `this` модуля (`undefined` в ESM), а не объект.
   Для методов используйте обычную функцию или поле-стрелку, созданное в конструкторе/классе.
4. **`Dog.prototype = Animal.prototype`.** Это не наследование, а общий прототип: `Dog` начнёт менять `Animal`.
   Нужен `Object.create(Animal.prototype)` и восстановленный `constructor`.
5. **`name` у ошибки.** `class MyError extends Error` не меняет `name` автоматически — задайте `this.name = 'MyError'`,
   иначе в логах будет `Error`. Для `cause` передавайте `super(message, { cause })`.
