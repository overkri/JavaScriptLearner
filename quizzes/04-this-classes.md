# Квиз 04 · `this`, прототипы, классы

> 8 вопросов: сначала предскажите вывод и объясните его, затем откройте ответ.
> Проверить себя можно тестами модуля: `npx vitest run tests/m04`.

## 1. Потерянный `this`

```js
const counter = {
  value: 0,
  increment() {
    this.value += 1;
    return this.value;
  },
};

const increment = counter.increment;
console.log(increment());
```

<details><summary>Ответ</summary>

Будет выброшено `TypeError: Cannot read properties of undefined (reading 'value')`.

`increment` — обычная функция, а не стрелка. `this` определяется в момент вызова: `counter.increment()`
дало бы `this === counter`, но `increment()` вызвана как обычная функция. В ESM действует strict mode,
поэтому `this === undefined`, и обращение `this.value` падает. Если бы код выполнялся в нестрогом скрипте,
`this` был бы глобальным объектом и результат оказался бы `NaN`.

Исправления: `counter.increment()`, `const increment = counter.increment.bind(counter)` или
`const increment = () => counter.increment()`.

</details>

## 2. `call`, `apply`, `bind`

```js
function introduce(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const user = { name: 'Ada' };

console.log(introduce.call(user, 'Hello', '!'));
console.log(introduce.apply(user, ['Hi', '?']));
const bound = introduce.bind(user, 'Hey');
console.log(bound('...'));
```

<details><summary>Ответ</summary>

```text
Hello, Ada!
Hi, Ada?
Hey, Ada...
```

- `call` принимает `this` и аргументы по одному.
- `apply` принимает `this` и массив аргументов.
- `bind` возвращает новую функцию: `this` привязан навсегда, а `'Hey'` стал первым аргументом
  (частичное применение). Вызов `bound('...')` добавляет пунктуацию.

`bound.call({ name: 'Other' })` всё равно оставит `this === user`: привязка `bind` не переопределяется.

</details>

## 3. Стрелка и `this` модуля

```js
const task = {
  title: 'TaskFlow',
  readNormal() {
    return this.title;
  },
  readArrow: () => this?.title,
};

console.log(task.readNormal());
console.log(task.readArrow());
```

<details><summary>Ответ</summary>

```text
TaskFlow
undefined
```

`readNormal` — обычный метод, поэтому `this` — объект `task`. Стрелка не создаёт собственный `this`:
она захватывает `this` из области, где была **создана**. На верхнем уровне ES-модуля `this === undefined`,
поэтому `this?.title` даёт `undefined`. Если убрать `?.`, будет `TypeError`.

Стрелка в объектном литерале — почти всегда ошибка, если нужен `this` самого объекта.

</details>

## 4. Цепочка прототипов

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.fetch = function () {
  return `${this.name} fetches the ball`;
};

const rex = new Dog('Rex');
console.log(rex.speak());
console.log(rex.fetch());
console.log(rex instanceof Dog, rex instanceof Animal);
console.log(Object.hasOwn(rex, 'speak'), 'speak' in rex);
```

<details><summary>Ответ</summary>

```text
Rex makes a sound
Rex fetches the ball
true true
false true
```

Цепочка: `rex → Dog.prototype → Animal.prototype → Object.prototype → null`.
`Animal.call(this, name)` записывает `name` в собственные свойства `rex`, а `speak` и `fetch` берутся
из прототипов. Поэтому `Object.hasOwn(rex, 'speak')` — `false`, а `'speak' in rex` — `true`.
`instanceof` проходит по цепочке и находит и `Dog.prototype`, и `Animal.prototype`.

</details>

## 5. `class`, `static`, геттер и `#private`

```js
class Store {
  static count = 0;
  #state;

  constructor(initialState = {}) {
    this.#state = initialState;
    Store.count += 1;
  }

  get size() {
    return Object.keys(this.#state).length;
  }

  setState(patch) {
    this.#state = { ...this.#state, ...patch };
    return this.#state;
  }
}

const store = new Store({ count: 0 });
store.setState({ theme: 'dark' });
console.log(store.size);
console.log(Store.count);
console.log(Object.keys(store));
```

<details><summary>Ответ</summary>

```text
2
1
[]
```

`size` — геттер: обращение `store.size` вызывает функцию и считает ключи `{ count: 0, theme: 'dark' }`.
`static count` принадлежит конструктору `Store`, а не экземпляру. `#state` — приватное поле: оно не попадает
в `Object.keys` и недоступно снаружи (`store.#state` — синтаксическая ошибка вне класса).
`setState` не мутирует старый объект, а создаёт новый через spread.

</details>

## 6. Отписка во время `emit`

```js
import { EventEmitter } from './src/core/EventEmitter.js';

const emitter = new EventEmitter();
const log = [];
const second = () => log.push('second');

emitter.once('ready', () => log.push('once'));
emitter.on('ready', () => {
  log.push('first');
  emitter.off('ready', second);
});
emitter.on('ready', second);

emitter.emit('ready');
emitter.emit('ready');
console.log(log);
```

<details><summary>Ответ</summary>

```text
[ 'once', 'first', 'second', 'first' ]
```

Первый `emit` идёт по **копии** набора слушателей. `once`-обёртка срабатывает и отписывается,
затем первый обработчик добавляет `'first'` и удаляет `second`. Но `second` уже есть в копии текущей рассылки,
поэтому всё равно вызывается и добавляет `'second'`.

Второй `emit` видит только первый обработчик (он не был `once`), поэтому снова добавляет `'first'`.
Именно поэтому `emit` не должен удалять слушателей из коллекции, по которой идёт итерация.

</details>

## 7. `Symbol.iterator` и `toJSON`

```js
import { TaskList } from './src/domain/TaskList.js';

const list = new TaskList([{ id: 'a' }, { id: 'b' }]);
console.log([...list].map((task) => task.id).join(','));
console.log(JSON.stringify(list));
console.log(list.length);
```

<details><summary>Ответ</summary>

```text
a,b
[{"id":"a"},{"id":"b"}]
2
```

Spread и `for...of` используют метод `[Symbol.iterator]()`; в `TaskList` он реализован генератором,
который отдаёт задачи по одной. `JSON.stringify` проверяет у объекта метод `toJSON()` и сериализует
его результат — поэтому наружу выходит обычный массив, а не `{"tasks":[...]}`.
`length` — геттер, возвращающий длину внутреннего массива.

</details>

## 8. Иерархия ошибок и `cause`

```js
class AppError extends Error {
  constructor(message, { cause, code } = {}) {
    super(message, { cause });
    this.name = 'AppError';
    this.code = code;
  }
}

class ValidationError extends AppError {
  constructor(message, field, options = {}) {
    super(message, { ...options, code: 'VALIDATION_ERROR' });
    this.name = 'ValidationError';
    this.field = field;
  }
}

const root = new Error('empty title');
const error = new ValidationError('Title is invalid', 'title', { cause: root });

console.log(error instanceof ValidationError, error instanceof AppError, error instanceof Error);
console.log(error.name, error.code, error.field);
console.log(error.cause === root);
```

<details><summary>Ответ</summary>

```text
true true true
ValidationError VALIDATION_ERROR title
true
```

`extends` связывает прототипы, поэтому `instanceof` истинен на всех трёх уровнях. `super(...)` вызывает
конструктор `AppError`, а тот передаёт `cause` в `Error` через второй аргумент `options`. `name` нужно
выставлять явно: сам `Error` не знает имени подкласса. `code` подставляется в `ValidationError` и перекрывает
значение из `options`, а `field` сохраняется в собственном свойстве.

</details>
