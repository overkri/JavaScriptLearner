# 07 · Асинхронность

> Модуль 7: упражнения `src/utils/async.js`, `src/api/client.js`, `src/api/taskApi.js`,
> `src/api/sync.js`, `src/features/search/liveSearch.js`, `src/playground/eventLoopQuiz.js`,
> `src/playground/asyncPitfalls.js`.
>
> **Тесты модуля:** `npx vitest run tests/m07` · [папка тестов](../tests/m07)

**TaskFlow:** загрузка задач с «сервера», лоадер, retry, отмена запросов, оптимистичное сохранение.

## Event loop за минуту

JS однопоточный. Сначала выполняется синхронный код, затем **все микрозадачи**, затем **одна макрозадача** — и снова микрозадачи.

1. **Синхронный код** — call stack.
2. **Микрозадачи:** `Promise.then`, `queueMicrotask`, продолжения после `await`.
3. **Макрозадачи:** `setTimeout`, `setInterval`, события DOM.

`await` уступает управление всегда, даже если значение уже готово (`await null`). Поэтому код после `await` выполняется позже синхронного хвоста функции.

## Promise и комбинаторы

`Promise` — состояние `pending → fulfilled | rejected`; `then/catch/finally` возвращают новый промис.

| Комбинатор           | Поведение                                                            |
| -------------------- | -------------------------------------------------------------------- |
| `Promise.all`        | ждёт все; первый reject отклоняет весь результат                     |
| `Promise.allSettled` | ждёт все; возвращает `{ status, value \| reason }` — частичный успех |
| `Promise.race`       | первый settled (resolve или reject)                                  |

`async`-функция **всегда** возвращает `Promise`. `return await` нужен, если ошибку надо поймать в `try/catch` этой же функции.

## Что есть в проекте

- `sleep(ms)` — промис через `setTimeout`.
- `withTimeout(promise, ms, message?)` — `Promise.race` с таймером; бросает `TimeoutError`, таймер очищается в `finally`.
- `retry(fn, { retries = 3, delayMs = 100, factor = 2, shouldRetry })` — экспоненциальный backoff; `retries` — число повторов **после** первой попытки.
- `promisify(cbFn)` — error-first callback → промис.
- `mapAsync(items, fn)` — параллельно (`Promise.all`); `eachSeries(items, fn)` — последовательно (`for...of` + `await`); `settleAll(promises)` — безопасный `allSettled`; `safeAsync(fn)` → `{ ok: true, value }` или `{ ok: false, error }`.
- `runSequential(tasks)` — `for...of` + `await`; `runParallel(tasks, limit)` — пул воркеров, результаты в исходном порядке.
- `request(url, { method, body, signal, timeoutMs, fetchImpl })` — JSON, проверка `response.ok`, `NotFoundError`/`NetworkError`, `AbortError` пробрасывается.
- `fetchTasks`, `fetchSettings`, `createTask`, `updateTask`, `deleteTask` — `createTask` **без retry** (POST неидемпотентен), остальные с retry; `NotFoundError` не повторяется.
- `loadInitialData()` — `Promise.allSettled`: задачи и настройки, частичный успех; `optimisticUpdate(store, optimisticFn, apiCall, { notify })` — при ошибке откат и toast.
- `createLiveSearch({ search, onResults, onError, delay })` — `debounce` + `AbortController`; устаревший ответ игнорируется по `signal.aborted`.

## Java → JS

| Java                                  | JavaScript                                          |
| ------------------------------------- | --------------------------------------------------- |
| `CompletableFuture<T>`                | `Promise<T>`                                        |
| `CompletableFuture.allOf(...).join()` | `Promise.all([...])`                                |
| `exceptionally` / `handle`            | `catch` / `Promise.allSettled`                      |
| `ExecutorService` + пул потоков       | event loop, один поток: `runParallel(tasks, limit)` |
| `Future.cancel()` / таймаут           | `AbortController` / `withTimeout`                   |

## Типичные ловушки

1. **`forEach` + `await`** — `forEach` игнорирует возвращённые промисы. Параллельно: `mapAsync` (`Promise.all`), последовательно: `eachSeries` (`for...of`).
2. **`Promise.all` падает целиком** из-за одного reject — для «загрузить что можно» нужен `allSettled`.
3. **Гонка запросов** — медленный ответ на старый запрос перезаписывает свежий. Лечится `AbortController` и проверкой `signal.aborted` перед колбэком.
4. **`fetch` не бросает на 404/500** — обязательно проверять `response.ok`; иначе ошибка «успешно» распарсится как данные.
5. **Retry неидемпотентного запроса** — повтор POST создаёт дубликат. Retry — только для GET/PUT/PATCH/DELETE с известным эффектом.
