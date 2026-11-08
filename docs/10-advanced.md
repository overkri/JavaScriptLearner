# Модуль 10. Продвинутые возможности

Шпаргалка по `src/features/search/queryParser.js`, `src/utils/intl.js`, `src/features/pagination.js`, `src/features/dnd.js`, `src/features/observable.js` и `src/playground/symbolsAndWeakMap.js`.

## Поиск: regex и именованные группы

`parseQuery` разбирает строку вида `tag:work priority:high !done "buy milk" due:<2026-12-01` в объект `{ tags, priority, status, excludeStatus, text, dueBefore }`.

- Сначала токенизация с учётом кавычек: `input.matchAll(/"([^"]*)"|(\S+)/g)`.
- Затем разбор токена регуляркой с именованными группами:
  ```js
  const KEY_RE = /^(?<key>tag|priority|status|due):(?<value>.*)$/;
  const { key, value } = KEY_RE.exec(token)?.groups ?? {};
  ```
- Исключение статуса: `/^!(?<status>todo|in-progress|done)$/`.
- Значения проверяются по `Set` (`low|medium|high`, `todo|in-progress|done`), дата — по `/^\d{4}-\d{2}-\d{2}$/`.
- Теги приводятся к lowercase и дедуплицируются; невалидный фильтр (`priority:urgent`) остаётся обычным текстом.
- `matchAll` требует флаг `g`; `match.groups` может быть `undefined`.

## Intl: даты, относительное время, плюрализация

- `formatDate(iso, locale = 'ru-RU')` — `new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' })`. Невалидная дата → `''`.
- `formatRelative(iso, now = new Date(), locale = 'ru-RU')` — разница в календарных днях и `Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(diffDays, 'day')` → «через 3 дня», «вчера», «сегодня».
- `pluralizeTasks(n, locale = 'ru-RU')` — `new Intl.PluralRules(locale).select(Math.abs(n))` и словарь `one → задача`, `few → задачи`, `many → задач`, `other → задачи`.
- Для `YYYY-MM-DD` создавайте локальную дату: `new Date(year, month - 1, day)`, иначе UTC-полночь сдвинет день в западных часовых поясах.

## Генераторы и ленивые итераторы

- `function*` возвращает итератор; тело выполняется только при `next()`, `yield` приостанавливает работу.
- `paginate(items, size)` выдаёт страницы; `size <= 0` → `RangeError` при итерации.
- `range(start, end, step = 1)` не включает `end`, поддерживает отрицательный шаг; `step === 0` → `RangeError`.
- `take(iterable, n)`, `mapIter(iterable, fn)`, `filterIter(iterable, predicate)` комбинируются лениво.
- `take` останавливается через `return`, поэтому `take(range(...), 3)` не вычисляет лишние значения.
- `for...of` при `break`/`return` вызывает у итератора `return()` и закрывает генератор.

## Drag & Drop

`enableDragAndDrop(boardEl, onMove)` навешивает делегированные обработчики и возвращает `cleanup`.

- `dragstart`: найти карточку через `event.target.closest('[data-id]')`, сохранить `draggedId`, вызвать `dataTransfer?.setData('text/plain', id)`, добавить `.dragging`.
- `dragover`: `event.preventDefault()` обязателен, иначе браузер не разрешит `drop`; `dropEffect = 'move'`, подсветить одну колонку классом `.drop-target`.
- `drop`: взять `id` из `dataTransfer` или `draggedId`, найти `[data-status]`, вызвать `onMove({ id, status })`, снять подсветки.
- `dragend`: снять `.dragging` и `.drop-target`, сбросить состояние.
- `cleanup` должен снять все `addEventListener`.

## Proxy и Reflect

`observable(target, onChange)` возвращает глубокий `Proxy`:

- `get` рекурсивно оборачивает вложенные объекты, путь хранится массивом: `['nested', 'x']`; кэш `WeakMap<object, Proxy>` сохраняет идентичность.
- `set` сравнивает старое и новое через `Object.is`; при изменении вызывает `onChange({ type: 'set', path, value, oldValue })`.
- `deleteProperty` уведомляет как `{ type: 'delete', path, value: undefined, oldValue }`.
- `Reflect.get/set/deleteProperty` сохраняют стандартное поведение; `Reflect.set` возвращает `boolean`.
- `push` в массив обычно уведомляет об изменении индекса; `length` движок обновляет сам, и отдельного `set` может не быть. `Date`/`Map`/`Set` лучше не оборачивать.
- `Proxy` не делает объект иммутабельным: `target` всё равно меняется.

## Symbol и WeakMap

- `INTERNAL = Symbol('taskflow.internal')` — уникальный ключ; `attachInternal(obj, value)` добавляет значение через `Object.defineProperty` с `enumerable: false`.
- Такое свойство не видно в `Object.keys`, `JSON.stringify` и при spread, но доступно через `readInternal(obj)`.
- `createPrivateStore()` хранит данные в `WeakMap`: ключи только объекты, записи не мешают сборке мусора, перебор невозможен.
- `memoizeByObject(fn)` кэширует результат по объекту-ключу: один и тот же объект → `fn` вызывается один раз.
- `WeakMap` не является итерируемым и не показывает содержимое в `JSON.stringify`.

## Java → JS

| Java                                 | JavaScript                                                           |
| ------------------------------------ | -------------------------------------------------------------------- |
| `Pattern` + именованные группы       | `/(?<key>...)/`, `match.groups`                                      |
| `DateTimeFormatter`, `MessageFormat` | `Intl.DateTimeFormat`, `Intl.RelativeTimeFormat`, `Intl.PluralRules` |
| `Stream.iterate().limit()`           | `function*` + `take()` — лениво, без материализации массива          |
| JavaFX `Dragboard` / `setOnDragOver` | `dataTransfer` + `dragstart` / `dragover` / `drop`                   |
| `WeakHashMap`                        | `WeakMap` — ключи-объекты, не мешает GC                              |
| Динамический прокси / AOP            | `Proxy` + `Reflect`                                                  |

## Типичные ловушки

1. **`g`-регулярка хранит состояние.** Повторный `re.test(...)` продолжает с `lastIndex`; для поиска всех совпадений используйте `matchAll` (только с `g`) или новый regex.
2. **Невалидные фильтры.** `priority:urgent` не должен молча становиться приоритетом: проверяйте значение по `Set`, иначе токен уходит в текст.
3. **UTC-даты.** `new Date('2026-12-01')` — полночь UTC; в отрицательном смещении это 30 ноября. Для `YYYY-MM-DD` используйте локальный конструктор. У `RelativeTimeFormat` по умолчанию `numeric: 'always'`, поэтому для «сегодня» нужен `numeric: 'auto'`.
4. **Ленивость генератора.** `range(0, 5, 0)` не бросит ошибку при создании — только при итерации. `take` должен сделать `return`, иначе бесконечный источник не остановится, а `for...of` закроет итератор сам.
5. **DnD и Proxy.** Без `preventDefault` в `dragover` `drop` не сработает; `Proxy` поверх `Date`/`Map`/`Set` часто ломает их внутренние слоты, а `target` при этом остаётся изменяемым.

## Запуск тестов модуля

```bash
npx vitest run tests/m10
```
