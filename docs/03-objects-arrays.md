# 03 · Объекты и массивы

**Цель модуля:** иммутабельная работа с данными — основа React и Redux.
Файлы модуля: `src/domain/task.js`, `src/domain/taskOps.js`, `src/domain/stats.js`, `src/domain/tags.js`, `src/playground/arrayMethodsKata.js`, `src/playground/refQuiz.js`.

## Деструктуризация и spread

```js
const { title, priority = 'medium', tags = [] } = task;
const [firstTag, ...otherTags] = tags;
const next = { ...task, title: 'Новое название', tags: [...tags, 'work'] };
```

Spread и `Object.assign` копируют только верхний уровень: вложенный объект остаётся общим. Для глубокой копии используйте `structuredClone(value)`, если значения это поддерживают.

## Методы массивов

- `map` преобразует, `filter` отбирает, `reduce` сворачивает (`sum([])` → `0`); `computeStats` собирает статусы, приоритеты и `Map` тегов одним проходом `reduce`.
- `find` возвращает элемент или `undefined`; `findIndex` — индекс или `-1` (`findTaskByTitle`, `indexOfPriority`).
- `some`/`every` — предикаты (`hasOverdue`, `allDone`); `every` на пустом массиве даёт `true`.
- `flatMap` разворачивает вложенные массивы (`flattenTags`), `at(-1)` берёт последний элемент (`lastTag`).
- `toSorted` и `toSpliced` (ES2023) не мутируют исходный массив (`sortedNumbers`, `insertAt`).

## Map и Set

`Set` хранит уникальные значения: `collectTags(tasks)` возвращает `Set<string>` в lowercase. `Map` хранит пары ключ-значение: `tagFrequency(tasks)` считает вхождения через `get(tag) ?? 0`; отсутствующий ключ даёт `undefined`. `renameTag` заменяет тег без дублей, а при пустом `to` удаляет его. В `computeStats` `topTags` — top-3 из `Map`, отсортированные по частоте и алфавиту.

## Иммутабельность

`createTask` валидирует вход, нормализует теги и возвращает объект с ISO-датами. `updateTask` создаёт новый объект, сохраняя `id` и `createdAt`, и обновляет `updatedAt`. Все операции `taskOps` (`addTask`, `removeTask`, `replaceTask`, `moveTask`, `toggleTag`, `filterTasks`, `sortTasks`, `groupByStatus`) чистые: вход не меняется, нетронутые задачи сохраняют ссылочную идентичность, а `removeTask` без совпадения возвращает исходный массив. Тесты замораживают вход через `Object.freeze` — мутация в strict mode бросит ошибку.

## Ссылки vs значения

Примитивы копируются по значению, объекты и массивы — по ссылке. `const b = a` и `[...arr]` не делают глубокую копию: элементы массива остаются теми же объектами. `Object.is(NaN, NaN)` — `true`, `Object.is(0, -0)` — `false`; `===` для объектов сравнивает ссылки, а не содержимое.

## sort

`Array.prototype.sort()` мутирует массив и без компаратора сортирует как строки: `[10, 9, 1].sort()` → `[1, 10, 9]`. Числовая сортировка — `toSorted((a, b) => a - b)`. В `sortTasks(tasks, by, direction)` сначала делается копия, поддерживаются `priority`, `dueDate`, `createdAt`, `title`; `dueDate === null` всегда в конце, заголовки сравниваются через `localeCompare`, сортировка стабильна.

## Java → JS

| Java                        | JavaScript                             |
| --------------------------- | -------------------------------------- |
| `record` + wither           | `{ ...task, title: 'New' }`            |
| `Stream.map/filter/collect` | `map` / `filter` / `reduce`            |
| `HashMap` / `HashSet`       | `Map` / `Set`                          |
| `List.copyOf`               | `[...list]`, `map`, `filter` (shallow) |
| `Comparator.comparing`      | компаратор в `sort` + `localeCompare`  |
| `equals` / `==`             | `===`, для объектов — сравнение ссылок |

## Типичные ловушки

1. `sort()` мутирует исходный массив и по умолчанию сравнивает строки; для чисел нужен `(a, b) => a - b`, для копии — `toSorted`.
2. `{ ...obj }` и `Object.assign({}, obj)` — поверхностные копии; вложенный объект всё ещё общий.
3. `for...in` перебирает ключи (включая унаследованные), `for...of` — значения итерируемых объектов; для массивов обычно нужен второй.
4. `forEach` не ждёт `await`: асинхронный callback завершится позже, а код после `forEach` уже выполнится. Нужен `for...of` с `await` или `Promise.all`.
5. `===` для двух одинаковых по содержимому объектов даёт `false`; изменение через алиас видно всем ссылкам, поэтому обновляйте данные через spread.

## Проверка

```bash
npx vitest run tests/m03
```

Квиз: [quizzes/03-objects-arrays.md](../quizzes/03-objects-arrays.md).
