# Отладка JavaScript-приложения

## Инструменты

1. **DevTools → Console** — быстрые проверки, `console.table`, `console.dir`,
   `console.time/timeEnd`, `console.group`.
2. **Sources** — breakpoints, watch, call stack, scope, logpoints.
3. **Network** — запросы, статусы, тайминги, throttling.
4. **Application → Local Storage** — кэш TaskFlow (`taskflow.v3`).
5. **Performance** — запись профиля, long tasks, layout shifts.

Для Node/Vitest удобен встроенный inspector:

```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs run tests/m03
```

Затем откройте `chrome://inspect` и подключитесь к процессу.

## Breakpoints, которые действительно помогают

- **Условный breakpoint**: правый клик по номеру строки → «Add conditional
  breakpoint». Например, `task.id === 'task-4'` — остановка только на нужной задаче.
- **Logpoint**: не останавливает выполнение, а печатает выражение. Удобно для
  циклов и обработчиков событий.
- **DOM breakpoint**: Elements → правый клик по узлу → Break on → subtree
  modifications. Так ловят неожиданные перерисовки.
- **Event listener breakpoint**: Sources → Event Listener Breakpoints → Mouse →
  click. Помогает понять, кто и в каком порядке обрабатывает клик.
- **XHR/fetch breakpoint**: остановка на запросе до его отправки.

## Watch и Scope

В момент остановки смотрите:

- `Local` — аргументы и локальные переменные;
- `Closure` — что замыкание реально держит в памяти (например, `timer`, `count`);
- `this` — особенно в методах и обработчиках;
- `Watch` — добавьте `state.tasks`, `controller.signal.aborted`, `event.target`.

Если значение в watch «не то», проверьте, не мутировали ли объект: ссылки в
JavaScript легко разделяются между «копиями».

## Асинхронный стек

В Sources включите **Async** в панели Call Stack. В современном Chrome
асинхронные вызовы показываются как единая цепочка. В Node используйте
`--async-stack-traces` (включено по умолчанию) и `Error.captureStackTrace`.

Типичный сценарий: `await` в обработчике, затем ошибка в `.then` — без
async-стека непонятно, откуда пришёл вызов. Добавляйте `cause` к ошибкам
(модуль 4) и логируйте `error.cause`.

## Сеть и гонки

1. Network → Throttling → «Slow 3G».
2. Повторите поиск: быстрый ввод «a», «ab», «abc».
3. Посмотрите, какой ответ пришёл последним и какой запрос был отменён
   (`AbortController` виден как canceled).
4. В Application очистите `taskflow.v3` и перезагрузите страницу — проверьте
   загрузку с нуля и stale-while-revalidate.

## Производительность

- `console.time('render')` / `console.timeEnd('render')` вокруг `renderBoard`.
- Performance → запись → вкладка Bottom-Up: ищите самые дорогие функции.
- Если обработчик срабатывает слишком часто, проверьте `debounce`/`throttle`
  и число listener'ов (вкладка Event Listeners).
- Утечки: detached DOM nodes в Memory, растущее число подписок в
  `EventEmitter`/`Store`.

## Отладка тестов

```bash
npx vitest run tests/m07 --reporter=verbose
npx vitest tests/m07/async.test.js --inspect-brk
```

- `test.each` печатает конкретный кейс.
- `expect(...).toMatchObject` показывает diff.
- `vi.spyOn` и `vi.fn()` — проверьте, сколько раз и с чем вызвана функция.
- `vi.useFakeTimers()` — если тест «висит», возможно, таймер не продвинули.

## Чек-лист при баге

1. Воспроизведите минимальным сценарием.
2. Сформулируйте ожидаемое и фактическое поведение.
3. Найдите границу: данные, состояние, рендер, сеть.
4. Поставьте breakpoint до и после подозрительной строки.
5. Проверьте ссылки и мутации (`Object.is`, `structuredClone`).
6. Добавьте регрессионный тест — он должен падать до фикса и проходить после.
7. Уберите шумные логи и запустите `npm run lint && npm test`.
