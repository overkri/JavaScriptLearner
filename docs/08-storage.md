# 08 · Хранилище и сериализация

> Модуль 8: упражнения `src/storage/localStorageAdapter.js`, `src/storage/migrations.js`,
> `src/storage/serialization.js`, `src/playground/jsonPitfalls.js`.
>
> **Тесты модуля:** `npx vitest run tests/m08` · [папка тестов](../tests/m08)

**TaskFlow:** кэш задач в `localStorage` — доска появляется мгновенно, затем синхронизируется с «сервером» (stale-while-revalidate).

## JSON: что переживает сериализацию

JSON — текст, а не объекты. Поддерживаются объект, массив, строка, конечное число, `boolean`, `null`.

- Свойства со значением `undefined` и функции **исчезают** из объекта.
- В массиве `undefined`, функция и `Symbol` становятся `null`; `NaN` и `Infinity` — тоже `null`.
- `Date` превращается в ISO-строку через `toJSON`; после `parse` это уже `string`, не `Date`.
- `Map` и `Set` сериализуются как `{}` — данные молча теряются.
- Циклическая ссылка → `TypeError: Converting circular structure to JSON`.
- `JSON.stringify(undefined)` возвращает `undefined` (не строку `"undefined"`).

## localStorage

Синхронное хранилище строк `key → value`, доступно только своему origin, обычно ~5 МБ. Переполнение квоты бросает исключение.

```js
const cache = createStorage('taskflow.v3', { defaultValue: null });
cache.save({ version: 3, tasks }); // true | false
cache.load(); // значение или defaultValue
cache.clear();
```

`createStorage(key, { storage, defaultValue })`:

- повреждённый JSON или отсутствие ключа → `defaultValue`, без исключения;
- `save` возвращает `false` при переполнении квоты и циклических данных;
- `save(undefined)` удаляет ключ (`JSON.stringify(undefined) === undefined`);
- `storage` подменяется в тестах на in-memory объект с `getItem/setItem/removeItem`.

## Версии схемы и миграции

`migrate(data)` приводит данные к версии 3 по цепочке **v1 → v2 → v3**:

- **v1:** нет `tags`; `dueDate` — ISO-строка или `null`;
- **v2:** `tags: string[]`; `dueDate` — timestamp (`number`) или `null`; нет `updatedAt`;
- **v3:** `tags` — lowercase без дублей; `dueDate` — `'YYYY-MM-DD'` или `null`; есть `updatedAt`.

Правила: отсутствующий `version` считается `1`; неизвестная версия → `Error`; вход не мутируется (`structuredClone`); миграция идемпотентна; `updatedAt = updatedAt ?? createdAt ?? now`. В `main.js` кэш читается так: `migrate(raw).tasks`.

## Date, Map, Set

- `dueDate` храните как `'YYYY-MM-DD'`, а не как `Date`: timestamp зависит от часового пояса.
- Для `Map`/`Set` нужны явные преобразования: `[...set]`, `[...map.entries()]`, `new Map(entries)`.

`serializeTasks(tasks)` / `deserializeTasks(json)` добавляют маркеры и восстанавливают типы:

```js
// Date → { __type: 'Date', value: '2026-12-01T00:00:00.000Z' }
// Set  → { __type: 'Set',  values: [...] }
// Map  → { __type: 'Map',  entries: [[key, value], ...] }
```

`replacer` смотрит на `this[key]`, потому что `Date.toJSON()` уже заменил значение строкой; `reviver` обрабатывает объекты снизу вверх. Цикл → `Error` со словом `circular` и исходным `TypeError` в `cause`; битый JSON → `SyntaxError`.

## Stale-while-revalidate

1. Прочитать кэш (`cache.load()`), прогнать `migrate`, сразу показать задачи.
2. Параллельно вызвать `loadInitialData()`.
3. Успех — заменить состояние серверными данными; ошибка — оставить кэш и показать toast.

## Java → JS

| Java                          | JavaScript                            |
| ----------------------------- | ------------------------------------- |
| Jackson `ObjectMapper`        | `JSON.stringify` / `JSON.parse`       |
| Flyway/Liquibase              | `migrate(data)` по версии схемы       |
| `LocalDate`                   | строка `'YYYY-MM-DD'`                 |
| `HashMap` / `HashSet`         | `Map` / `Set` (сериализуются вручную) |
| try-with-resources / fallback | `try/catch` + `defaultValue`          |

## Типичные ловушки

1. **`JSON.stringify(undefined)` — это `undefined`**, а не `"undefined"`: `save(undefined)` должен удалять ключ.
2. **`Date`, `Map`, `Set` теряют тип молча** — без маркеров и `reviver` получите строку или `{}`.
3. **Повреждённый JSON и старые версии** — обычное дело; `load` обязан вернуть `defaultValue`, а данные — пройти `migrate`.
4. **Циклы и квота** — `JSON.stringify`/`setItem` бросают; `save` возвращает `false`, приложение не падает.
5. **`localStorage` синхронный** — блокирует main thread; не храните там мегабайты и секреты.
