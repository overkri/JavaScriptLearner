# 01 · Основы языка

**Цель модуля:** типы, объявления, сравнения, truthy/falsy, `?.`/`??`, шаблонные строки.
Файлы модуля: `src/playground/typesQuiz.js`, `src/domain/priority.js`, `src/utils/format.js`, `src/utils/validators.js`, `src/playground/scopeQuiz.js`.

## Типы

В JS семь примитивов: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`. Всё остальное — объекты, включая массивы и функции.

- `number` — всегда 64-битное число с плавающей точкой (как Java `double`); `NaN` и `Infinity` тоже `number`.
- `bigint` (`10n`) — целые произвольной длины, не смешиваются с `number` в арифметике.
- `typeof` возвращает строку; массивы дают `'object'`, а функции — `'function'`.

`PRIORITY` в `src/domain/priority.js` — не Java-enum, а замороженный объект `Object.freeze({ LOW, MEDIUM, HIGH })`. Проверка допустимых значений остаётся обязанностью `isPriority(x)`: во время выполнения строку `'LOW'` никто не запретит.

## let и const

`let` и `const` имеют блочную область видимости и не поднимаются как `var`. `const` запрещает переприсваивание переменной, но не мутацию объекта: `const tags = []; tags.push('work')` работает. Обращение к `let`/`const` до объявления — `ReferenceError` (TDZ), а `var` до объявления даёт `undefined`.

## Сравнение

- `===` — строгое сравнение без приведения типов; используйте его по умолчанию.
- `==` приводит операнды; особое правило: `null == undefined` истинно, но `null == 0` ложно.
- `Object.is` отличается от `===` для `NaN` и `-0` (подробнее в модуле 3).

## Truthy и falsy

Falsy: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`. Всё остальное truthy, в том числе `'0'`, `' '`, `[]`, `{}`.

Поэтому в `src/utils/validators.js` нельзя проверять строку через `if (title)`: `' '` пройдёт проверку. `isNonEmptyString` должен смотреть на `typeof` и `trim()`, `validateTitle` — на длину после trim (1..80), а `validateDueDate` — на формат `YYYY-MM-DD` и реальную календарную дату.

## null, undefined, ?. и ??

`null` — явное отсутствие значения, `undefined` — значение не задано. `task?.title` безопасно вернёт `undefined`, если `task` равен `null` или `undefined`; `task?.tags ?? []` подставит пустой массив только для `null`/`undefined`.

`??` не заменяет `0`, `''` и `false` — это его отличие от `||`. Смешивать `??` с `||` или `&&` без скобок нельзя: будет `SyntaxError`.

## Шаблонные строки

Обратные кавычки дают интерполяцию и многострочность: `` `Привет, ${name}!` ``. В `src/utils/format.js` так собираются `formatTitle` (trim, схлопывание пробелов, обрезка до 80 с `…`), `formatTags` (`#work #home`) и `describeTask` (безопасно переживает `null`/`undefined`).

## Java → JS

| Java                           | JavaScript                         |
| ------------------------------ | ---------------------------------- |
| `String s = null`              | `let s = null` или `undefined`     |
| `==` для примитивов / `equals` | `===` для значения и типа          |
| `boolean`                      | любое значение truthy/falsy        |
| `String.format("...%s", x)`    | `` `...${x}` ``                    |
| `double`                       | `number` — тоже double             |
| `enum Priority`                | `Object.freeze` + рантайм-проверка |

## Типичные ловушки

1. `typeof null === 'object'` — историческая ошибка языка, но проверять `null` нужно через `value === null`.
2. `0.1 + 0.2` даёт `0.30000000000000004`, а не `0.3`; для денег/точности используйте округление или целые единицы.
3. `'5' - 2` даёт `3`, а `'5' + 2` — `'52'`: `+` конкатенирует строки, остальные операторы приводят к числу.
4. `NaN !== NaN`; проверка — `Number.isNaN(value)`, а не `value === NaN`.
5. `[10, 9, 1].sort()` возвращает `[1, 10, 9]`: по умолчанию сортировка строковая (и мутирует массив).

## Проверка

```bash
npx vitest run tests/m01
```

Квиз: [quizzes/01-basics.md](../quizzes/01-basics.md).
