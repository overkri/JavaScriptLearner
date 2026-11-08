# Модуль 11. Качество и типизация

Шпаргалка по JSDoc, `@ts-check`, ESLint, Prettier, отладке и bug hunt. Цель — привыкнуть к типам до TypeScript и научиться читать ошибки.

## JSDoc как типы

JSDoc — комментарии, но `tsc` и редактор понимают их как типы:

```js
/**
 * @typedef {'low'|'medium'|'high'} Priority
 * @typedef {Object} Task
 * @property {string} id
 * @property {Priority} priority
 */

/**
 * @template T, R
 * @param {Iterable<T>} iterable
 * @param {(value: T, index: number) => R} fn
 * @returns {Generator<R>}
 */
export function* mapIter(iterable, fn) {
  /* ... */
}
```

- `@param {string} title`, `@returns {number}`, `@type {number}`.
- `@template T` — аналог generics, `@callback` — аналог functional interface.
- Union и литеральные типы: `{'todo'|'done'}`, `{number|null}`.
- Импорт типа без рантайм-импорта: `@typedef {import('../domain/task.js').Task} Task`.
- JSDoc не проверяется в рантайме: неверная аннотация не бросит ошибку в JS.

## checkJs и typecheck

В `jsconfig.json` сейчас стоит `"checkJs": false` — его нужно **включить вручную** в этом модуле:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "noEmit": true
  },
  "include": ["src/**/*.js"]
}
```

- `// @ts-check` в начале файла включает проверку одного файла даже при `checkJs: false`.
- `npm run typecheck` запускает `npx -y -p typescript tsc -p jsconfig.json --noEmit`; TypeScript не добавляется в зависимости проекта.
- `tests/m11/jsdoc.test.js` проверяет, что у экспортируемых функций в `src/domain` есть JSDoc с `@returns`.
- В `src/playground/typeErrors.js` пять ошибок `FIXME(11.4.x)`: чините либо JSDoc, либо реализацию — по смыслу функции.

## ESLint и Prettier

- `npm run lint` — ESLint: `no-var`, `prefer-const`, `eqeqeq`, `no-unused-vars`, `no-async-promise-executor`, `require-await`.
- `npm run format` — Prettier пишет форматирование; `npm run format:check` только проверяет.
- ESLint ищет потенциальные ошибки, Prettier — стиль. Ни один не заменяет типы и тесты.
- Автоисправление: `npx eslint . --fix`; форматирование не меняет логику.

## Отладка

- DevTools → Sources: breakpoints (в том числе условные), `debugger`, watch, scope, call stack.
- Async call stack показывает цепочку `await`; Network throttling помогает воспроизвести гонки и таймауты.
- Проверяйте снимки состояния, а не мутируйте объект во время просмотра; для копии — `structuredClone`.
- Ошибка в `async`-функции без `await` не попадает в окружающий `try/catch` — это unhandled rejection.

## Bug hunt: три намеренных бага

Файлы в `src/playground/bugHunt/` **специально содержат три бага**, их не нужно «объяснять» — их нужно исправить:

| Файл             | Симптом                                                            | Исправление                                           |
| ---------------- | ------------------------------------------------------------------ | ----------------------------------------------------- |
| `mutationBug.js` | `addTagToTask` меняет `task.tags` и возвращает тот же объект       | `{ ...task, tags: [...task.tags, tag] }`              |
| `lostThisBug.js` | `createCounterBug().increment` теряет `this` при передаче колбэком | стрелка/замыкание или `bind`                          |
| `raceBug.js`     | `createSearchBug`: старый ответ перезаписывает новый               | sequence id, `onResult` только для последнего запроса |

```bash
npx vitest run tests/m11/bughunt.test.js
```

## Java → JS

| Java                        | JavaScript                        |
| --------------------------- | --------------------------------- |
| `javac` и ошибки компиляции | `tsc --noEmit` + `checkJs`        |
| Generics `<T>`              | `@template T` в JSDoc             |
| `interface` / `record`      | `@typedef {Object}` + `@property` |
| Checkstyle / SpotBugs       | ESLint                            |
| google-java-format          | Prettier                          |
| IDE debugger / JDB          | DevTools Sources, breakpoints     |

## Типичные ловушки

1. **`checkJs: false`.** `npm run typecheck` зелёный даже при явных ошибках: `tsc` просто не проверяет JS. Включите `"checkJs": true` или добавьте `// @ts-check`.
2. **JSDoc — не рантайм.** Аннотация `@returns {number}` не преобразует строку в число; тесты поймают поведение, а `tsc` — несоответствие типа.
3. **`npm run format` не чинит логику.** Prettier переставит пробелы, но оставит `var`, `==` и мутацию. Для ESLint-правил нужно менять код (или `eslint --fix`).
4. **Три бага — не один.** Мутация, потерянный `this` и гонка лежат в разных файлах; тесты `tests/m11/bughunt.test.js` падают по отдельности.
5. **Async-отладка.** Забытый `await` даёт unhandled rejection; `try/catch` без `await` не поймает reject, а стек может указывать не на место реальной ошибки.

## Команды модуля

```bash
npm run typecheck
npx vitest run tests/m11
```
