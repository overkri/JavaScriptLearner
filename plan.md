# plan.md — Курс «JavaScript для Java-разработчика» через проект TaskFlow

> **Для кодинг-агента.** Этот документ — полное ТЗ. Твоя задача: сгенерировать репозиторий-тренажёр, в котором студент (опытный Java-разработчик, JS не знает) за ~3–4 недели выполняет упражнения, а из результатов собирается рабочее приложение **TaskFlow** (канбан-доска задач) на чистом JavaScript, без фреймворков.
> Цель курса: подготовить к курсу «React + TypeScript». Поэтому приоритет — те части JS, которые реально нужны в React/TS: функции, замыкания, деструктуризация, spread, иммутабельность, методы массивов, ES-модули, async/await, `this`/классы, события, JSON, JSDoc-типизация.

---

## Часть 0. Правила для агента

### 0.1. Язык и стиль
- Комментарии-задания, документация, README — **на русском**. Идентификаторы, имена файлов, сообщения тестов — **на английском**.
- Современный JS: ES2022+, ES-модули (`"type": "module"`), `const`/`let`, никаких `var` (кроме специальных упражнений про `var`).
- Без TypeScript и без фреймворков. Разрешённые dev-зависимости: `vite`, `vitest`, `jsdom`, `eslint`, `prettier`. Рантайм-зависимостей — **ноль**.
- Node ≥ 20.

### 0.2. Как устроено каждое упражнение
Каждый учебный файл в `src/` — это **заглушка + задание в комментарии**. Студент заменяет заглушки реализацией, тесты из `tests/` позеленеют, а приложение обретёт новую функциональность.

Обязательный шаблон шапки файла:

```js
/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 3 · УПРАЖНЕНИЕ 3.2 — Чистые операции над задачами
 * ═══════════════════════════════════════════════════════════
 *  Тема:           spread, деструктуризация, иммутабельность
 *  Java-аналогия:  как List.copyOf() / record with-ers, но руками
 *  Тесты:          npx vitest run tests/m03/taskOps.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  Реализуй функции ниже. Ни одна не должна мутировать входные данные.
 *
 *  ТРЕБОВАНИЯ
 *  1. addTask(tasks, task) — вернуть НОВЫЙ массив с задачей в конце.
 *  2. ...
 *
 *  ПОДСКАЗКИ (раскрывай по одной)
 *  - Подсказка 1: ...
 *  - Подсказка 2: ...
 *
 *  ЛОВУШКА
 *  Что произойдёт, если сделать tasks.push(task) и вернуть tasks?
 * ═══════════════════════════════════════════════════════════
 */

/** @param {Task[]} tasks @param {Task} task @returns {Task[]} */
export function addTask(tasks, task) {
  throw new Error('TODO 3.2.1: not implemented');
}
```

Правила заглушек:
- Каждая заглушка бросает `new Error('TODO <номер>: not implemented')`.
- JSDoc-сигнатуры (`@param`, `@returns`) пиши сразу — они подготовка к TypeScript.
- Файл ≤ ~150 строк, одна идея на файл.

### 0.3. Решения и проверка качества
- Эталонные решения лежат в `solutions/` с зеркальной структурой (`solutions/src/...`). В `src/` решений быть **не должно**.
- Скрипт `scripts/verify-solutions.js`: копирует `solutions/src` поверх `src` во временную папку и прогоняет **все** тесты. Агент обязан запустить его и добиться 100% зелёных тестов до завершения работы.
- Сам студент в `solutions/` смотрит только после попытки (написать об этом в README).

### 0.4. Тесты
- Vitest. Для логики — окружение `node`, для DOM — `jsdom` (`// @vitest-environment jsdom` в шапке теста).
- Тесты читаемые, названия описывают поведение: `it('does not mutate the input array', ...)`. Падающее сообщение должно подсказывать, что не так.
- Тесты лежат в `tests/mNN/` (NN — номер модуля).
- На старте (без решений) тесты **падают** — это нормально, но не должны падать из-за синтаксических ошибок/неверных импортов.

### 0.5. Дополнительные артефакты на каждый модуль
1. `docs/NN-<topic>.md` — шпаргалка ≤ 1 страницы: ключевые концепции, таблица «Java vs JS», 3–5 типичных ловушек.
2. `quizzes/NN-<topic>.md` — 5–8 вопросов «что выведет этот код и почему?» с ответами в **сворачиваемом** `<details>`.
3. Раздел в `PROGRESS.md` — чеклист упражнений (`- [ ] 3.2 taskOps`).
4. «Веха» — что студент должен увидеть в браузере после модуля (описана ниже в каждом модуле).

### 0.6. Чего НЕ делать
- Не использовать фреймворки, jQuery, lodash и прочие библиотеки.
- Не писать решения в `src/`.
- Не раздувать комментарии: задание — чётко и по делу, без воды.
- Не усложнять сборку: Vite с дефолтным конфигом.

---

## Часть 1. План обучения

Предполагаемый темп: 1–2 часа в день, ~4 недели. Модули можно проходить быстрее.

| № | Модуль | Ключевые темы | Время | Вехa в приложении |
|---|--------|---------------|-------|-------------------|
| 0 | Старт и инструменты | Node, npm, Vite, Vitest, DevTools, REPL | 1–2 ч | Открывается статичная доска (HTML/CSS даёт агент) |
| 1 | Основы языка | типы, `let/const`, `==` vs `===`, truthy/falsy, `null/undefined`, `?.`, `??`, шаблонные строки | 3–4 ч | Форматирование задач (приоритеты, даты) |
| 2 | Функции и замыкания | arrow, default/rest, first-class, callback, closure, `debounce`, `memoize`, `pipe` | 4–5 ч | Утилиты для всего приложения |
| 3 | Объекты и массивы | деструктуризация, spread, `map/filter/reduce`, `Map/Set`, иммутабельность | 5–6 ч | Вся логика задач: CRUD, фильтры, статистика |
| 4 | `this`, прототипы, классы | `this`, `bind`, прототипы, `class`, `#private`, `static`, `Symbol.iterator`, ошибки | 4–5 ч | `EventEmitter`, `Store`, `TaskList` |
| 5 | ES-модули | `import/export`, named vs default, barrel, dynamic `import()`, циклические зависимости | 2 ч | Ленивая загрузка экрана статистики |
| 6 | DOM и события | `querySelector`, `createElement`, делегирование, всплытие, `dataset`, формы, XSS | 6–7 ч | **Доска оживает**: карточки, модалка, форма |
| 7 | Асинхронность | event loop, Promise, `async/await`, `Promise.all/allSettled/race`, `AbortController`, retry | 6–7 ч | Загрузка/сохранение через «сервер», лоадеры, ошибки |
| 8 | Хранилище и сериализация | JSON, `localStorage`, версии схемы, миграции, `Date` | 2–3 ч | Данные переживают перезагрузку |
| 9 | Состояние и архитектура | reducer, actions, selectors, undo/redo, pub/sub | 4–5 ч | Undo/Redo, единый store |
| 10 | Продвинутые возможности | regex, `Intl`, генераторы, Drag&Drop API, `Proxy` (бонус) | 4–5 ч | Поиск-запросы `tag:work !done`, DnD, локализация |
| 11 | Качество и типизация | JSDoc + `@ts-check`, ESLint, Prettier, отладка | 2–3 ч | Проект проходит `tsc --noEmit`-подобную проверку |
| 12 | Мини-React (capstone) | `h()`, компоненты, `useState`, `useEffect`, перерисовка | 6–8 ч | UI переписан на собственных «компонентах» |

После модуля 12 — документ `docs/99-bridge-to-react-ts.md`: таблица «что из курса → где встретится в React/TS».

### Принципы дидактики (учитывай при генерации)
1. **Контраст с Java.** В каждой шпаргалке — блок «Java → JS». Студент знает ООП, generics, потоки, коллекции — опирайся на это.
2. **Ловушки — часть курса.** Каждая «странность» JS (`this`, `==`, hoisting, `typeof null`, `[] + {}`, порядок async) — отдельное упражнение или квиз.
3. **Сначала чистые функции, потом DOM.** Логика (модули 1–5) тестируется без браузера.
4. **Повторное использование.** Утилиты из модуля 2 используются в модулях 6–10 (`debounce` — в поиске, `memoize` — в селекторах, `pipe` — в фильтрах).
5. **Эволюция кода.** `Store` из модуля 4 в модуле 9 превращается в reducer-store; UI из модуля 6 в модуле 12 переписывается на компоненты. Это нужно показать явно (раздел «Рефакторинг» в задании).

---

## Часть 2. Проект TaskFlow

### 2.1. Описание
Канбан-доска: три колонки (`todo`, `in-progress`, `done`), карточки задач, теги, приоритеты, дедлайны, поиск, статистика, undo/redo, «серверное» хранилище с задержками и ошибками, локальное кэширование, drag & drop.

### 2.2. Доменная модель

```js
/**
 * @typedef {'low'|'medium'|'high'} Priority
 * @typedef {'todo'|'in-progress'|'done'} Status
 * @typedef {Object} Task
 * @property {string}      id
 * @property {string}      title        // 1..80 символов, непустой после trim
 * @property {string}      description
 * @property {Status}      status
 * @property {Priority}    priority
 * @property {string[]}    tags         // lowercase, без дублей
 * @property {string}      createdAt    // ISO-строка
 * @property {string}      updatedAt    // ISO-строка
 * @property {string|null} dueDate      // ISO-строка (YYYY-MM-DD) или null
 */
```

### 2.3. Структура репозитория

```
taskflow-js-course/
├─ README.md                  # как проходить курс, команды, правила
├─ PROGRESS.md                # чеклист упражнений по модулям
├─ package.json               # scripts: dev, test, test:m, lint, format, verify
├─ vite.config.js
├─ eslint.config.js
├─ jsconfig.json              # включается в модуле 11 (checkJs)
├─ index.html                 # оболочка приложения
├─ docs/                      # шпаргалки 00..12 + 99-bridge-to-react-ts.md
├─ quizzes/                   # квизы 01..12
├─ scripts/
│  ├─ verify-solutions.js     # проверка эталонов
│  └─ progress.js             # печатает прогресс по модулям (по результатам vitest --reporter=json)
├─ src/
│  ├─ main.js                 # точка входа; растёт от модуля к модулю
│  ├─ styles.css              # готовый CSS (даёт агент, студент не трогает)
│  ├─ domain/                 # task.js, priority.js, taskOps.js, tags.js, TaskList.js
│  ├─ utils/                  # format.js, validators.js, functional.js, id.js, intl.js
│  ├─ core/                   # EventEmitter.js, Store.js, errors.js, index.js
│  ├─ state/                  # reducer.js, store.js, history.js, selectors.js
│  ├─ ui/                     # dom.js, TaskCard.js, Board.js, Modal.js, TaskForm.js, Toast.js
│  ├─ api/                    # fakeServer.js (готовый), client.js, taskApi.js
│  ├─ storage/                # localStorageAdapter.js, migrations.js
│  ├─ features/               # stats/, search/, dnd.js
│  ├─ playground/             # «песочницы» вне приложения: eventLoopQuiz.js, thisQuiz.js, ...
│  └─ mini-react/             # createElement.js, render.js, hooks.js, components/
├─ solutions/src/...          # эталонные решения (зеркало src/)
└─ tests/m00 ... m12/
```

### 2.4. Готовые части (пишет агент целиком, студент их не трогает)
- `index.html`, `src/styles.css` — оболочка и стили (светлая/тёмная тема через CSS-переменные).
- `src/api/fakeServer.js` — in-memory «бэкенд», реализующий `fakeFetch(url, options)` с интерфейсом, совместимым с `fetch` (возвращает настоящий `Response`). Эндпоинты: `GET/POST /api/tasks`, `GET/PUT/PATCH/DELETE /api/tasks/:id`. Настройки: задержка 200–800 мс, вероятность случайной ошибки 15% (`500`), поддержка `AbortSignal`. Начальные данные — 12 задач.
- Заглушки-«скелет» `main.js`, подключающий модули по мере их готовности (с `try/catch` вокруг незавершённых частей и понятным сообщением в консоль: «Модуль 6 ещё не выполнен»).

---

## Часть 3. Детальная спецификация модулей

> Для каждого файла указано: **что студент реализует**, и **что проверяют тесты**. Сигнатуры — обязательны, чтобы тесты были однозначными. Агент вправе добавить 1–3 дополнительных мелких упражнения на модуль, если они укладываются в тему.

---

### Модуль 0. Старт и инструменты
**Цель:** запустить окружение, освоить REPL и DevTools.

| Файл | Задание |
|------|---------|
| `docs/00-setup.md` | Как запустить `npm install`, `npm run dev`, `npm test`; как открыть DevTools (Console, Sources, Network); `node` REPL; чем Node отличается от браузера |
| `src/playground/hello.js` | Вывести разными способами в консоль: `console.log/table/dir/error/group/time`. Тест: файл экспортирует функцию `greet(name)`, возвращающую строку |
| `tests/m00/smoke.test.js` | Проверка, что окружение работает (после `greet` — зелёный) |

**Веха:** `npm run dev` открывает статичную доску из готового HTML.

**Шпаргалка Java→JS:** `npm` vs Maven/Gradle; `package.json` vs `pom.xml`; динамическая типизация; JS однопоточный; нет компиляции (но есть сборка Vite).

---

### Модуль 1. Основы языка
**Цель:** понять типы, сравнения, область видимости и «странности».

| Файл | Задание | Что проверяют тесты |
|------|---------|---------------------|
| `src/playground/typesQuiz.js` | 12 строк кода с `typeof`, `==`, `+`, `NaN`, `[] + {}`. Студент **сначала предсказывает** результат в комментарии, потом запускает | Тест сверяет предсказания с реальными значениями (экспортируется объект `answers`) |
| `src/domain/priority.js` | «Enum» через `Object.freeze`: `PRIORITY = {LOW, MEDIUM, HIGH}`; `priorityWeight(p)`; `isPriority(x)` | Заморожен ли объект; неизвестный приоритет → `-1` / `false` |
| `src/utils/format.js` | `formatTitle(str)` (trim + схлопывание пробелов + обрезка до 80 с «…»); `formatTags(tags)` → `"#work #home"`; `describeTask(task)` — шаблонная строка | Пустые/`null`/`undefined` входы, `??` и `?.` |
| `src/utils/validators.js` | `validateTitle(title)` → `{ ok: boolean, error?: string }`; `validateDueDate(iso)`; `isNonEmptyString(x)` | Truthy/falsy-ловушки: `0`, `''`, `'0'`, `' '` |
| `src/playground/scopeQuiz.js` | hoisting `var` vs `let`, TDZ, `const` и мутация объекта, блочная область | Предсказания, как в `typesQuiz` |

**Веха:** карточки на статичной доске получают корректные заголовки и приоритеты (в `main.js` вызываются `formatTitle`, `priorityWeight`).

**Ловушки (в квиз):** `typeof null`, `0.1 + 0.2`, `'5' - 2` vs `'5' + 2`, `NaN !== NaN`, `==` и `null/undefined`, `parseInt('08')`, `[10, 9, 1].sort()`.

---

### Модуль 2. Функции и замыкания
**Цель:** функции — значения первого класса; замыкания как основа всего.

| Файл | Задание (сигнатура) | Что проверяют тесты |
|------|---------------------|---------------------|
| `src/utils/id.js` | `createIdGenerator(prefix = 'task')` → функция, при каждом вызове возвращающая `task-1`, `task-2`, … (счётчик в замыкании); `uid()` на основе `crypto.randomUUID` | Независимость счётчиков разных генераторов; счётчик недоступен снаружи |
| `src/utils/functional.js` | `once(fn)`; `debounce(fn, ms)`; `throttle(fn, ms)`; `memoize(fn, keyFn = JSON.stringify)`; `pipe(...fns)`; `compose(...fns)`; `curry(fn)` | Fake timers (`vi.useFakeTimers`), число вызовов, сохранение `this` и аргументов |
| `src/utils/functional.js` (часть 2) | `partial(fn, ...preset)`, `tap(fn)`, `not(predicate)` | Композиция с `Array.prototype.filter` |
| `src/playground/closureQuiz.js` | Классика: цикл с `var` + `setTimeout`; как починить (`let` / IIFE); счётчик-замыкание | Предсказания + рабочие исправления |
| `src/playground/thisArrowQuiz.js` | Разница обычной и стрелочной функции: `arguments`, `this`, возможность `new` | Предсказания |

**Веха:** в `main.js` генерация ID задач через `createIdGenerator`, `pipe` собирает цепочку форматирования заголовка.

**Рефакторинг:** `format.js` из модуля 1 переписать через `pipe`.

---

### Модуль 3. Объекты и массивы (ядро курса — самый объёмный)
**Цель:** работать с данными в иммутабельном стиле — основа React.

| Файл | Задание (сигнатура) | Что проверяют тесты |
|------|---------------------|---------------------|
| `src/domain/task.js` | `createTask({ title, description = '', priority = 'medium', tags = [], dueDate = null })` — фабрика с валидацией, нормализацией тегов (lowercase, без дублей через `Set`), датами; `updateTask(task, patch)`; `isOverdue(task, now = new Date())` | Значения по умолчанию, деструктуризация, неизменность исходного объекта, `updatedAt` меняется |
| `src/domain/taskOps.js` | **Все функции чистые, не мутируют вход.** `addTask(tasks, task)`; `removeTask(tasks, id)`; `replaceTask(tasks, id, patch)`; `moveTask(tasks, id, status)`; `toggleTag(task, tag)` | `Object.freeze` на входных данных — мутация бросит ошибку в strict mode; сравнение ссылок: нетронутые элементы **сохраняют ссылочную идентичность** |
| `src/domain/taskOps.js` (часть 2) | `filterTasks(tasks, { status, priority, tag, text })`; `sortTasks(tasks, by, direction)` (`by`: `'priority' \| 'dueDate' \| 'createdAt' \| 'title'`, стабильность!); `groupByStatus(tasks)` → `{ todo: [], 'in-progress': [], done: [] }` | `localeCompare`, `null` в `dueDate` всегда в конце, комбинации фильтров |
| `src/domain/stats.js` | `computeStats(tasks)` → `{ total, byStatus, byPriority, overdue, completionRate, topTags }` — **одним проходом `reduce`** | Корректность чисел; `topTags` — top-3 через `Map`/`Object.entries` + `sort` |
| `src/domain/tags.js` | `collectTags(tasks)` → `Set`; `tagFrequency(tasks)` → `Map`; `renameTag(tasks, from, to)` | Работа с `Set`/`Map`, `flatMap`, `Array.from`, spread |
| `src/playground/refQuiz.js` | Ссылки vs значения, shallow vs deep copy, `structuredClone`, `Object.is`, почему `[...arr]` не копирует вложенные объекты | Предсказания |
| `src/playground/arrayMethodsKata.js` | 10 мини-задач на `map/filter/reduce/find/findIndex/some/every/flat/flatMap/at/toSorted/toSpliced` (без циклов `for`) | Тесты на каждую |

**Веха:** в консоли браузера доступен `window.__tasks`, `computeStats(__tasks)` выдаёт корректные числа; в `main.js` печатается таблица `console.table(groupByStatus(tasks))`.

**Ловушки:** `sort()` мутирует и по умолчанию сортирует как строки; `forEach` не ждёт `await`; `Object.assign` — shallow; `for...in` vs `for...of`; `delete` и `undefined`-свойства.

---

### Модуль 4. `this`, прототипы, классы
**Цель:** понять, чем «классы» JS отличаются от Java, и почему `this` ломается.

| Файл | Задание | Что проверяют тесты |
|------|---------|---------------------|
| `src/playground/thisQuiz.js` | 8 сценариев потери `this` (метод в колбэк, `setTimeout`, `addEventListener`); исправить через `bind`, стрелку, обёртку; `call/apply` | Исправленные версии |
| `src/playground/prototypeQuiz.js` | Построить «наследование» вручную: функция-конструктор + `Object.create`; показать цепочку прототипов; `hasOwn` vs `in` | Цепочка и `instanceof` |
| `src/core/errors.js` | `class AppError extends Error` (с `cause`), `ValidationError` (поле `field`), `NotFoundError`, `NetworkError` (поле `status`); корректный `name`, `instanceof`, stack | `instanceof` через иерархию, `error.cause` |
| `src/core/EventEmitter.js` | `class EventEmitter` — `on(event, handler)` (возвращает функцию отписки), `off`, `once`, `emit(event, ...args)`; приватное поле `#listeners` (`Map<string, Set<Function>>`) | Отписка во время `emit`, `once`, изоляция событий, handler-ошибка не ломает остальных |
| `src/core/Store.js` | `class Store extends EventEmitter` — `getState()`, `setState(patch)` (иммутабельно, шаллоу-merge), `subscribe(listener)` → unsubscribe; `static from(initial)`; геттер `size` | Нотификации только при реальном изменении, неизменность старого state |
| `src/domain/TaskList.js` | `class TaskList` — обёртка над массивом задач: `add`, `remove`, геттер `length`, `[Symbol.iterator]`, `static fromJSON(json)`, `toJSON()` | `for...of`, spread `[...list]`, `JSON.stringify(list)` |

**Веха:** `Store` хранит задачи, а `main.js` подписывается на него и выводит в консоль изменения.

**Java-контраст:** нет настоящих классов (синтаксический сахар над прототипами), нет перегрузки методов, нет `interface` и `abstract`, `#private` vs `private`, конструктор один, `super()` обязателен.

---

### Модуль 5. ES-модули
**Цель:** организация кода, `import/export`, ленивая загрузка.

| Файл | Задание | Что проверяют тесты |
|------|---------|---------------------|
| `src/core/index.js` | Barrel-файл: реэкспорт `EventEmitter`, `Store`, ошибок, `TaskList` | Все имена доступны из одного импорта |
| `src/domain/index.js` | Barrel для домена; дефолтный экспорт `createTask` + именованные остальные | Named vs default |
| `src/playground/cycleDemo/` (`a.js`, `b.js`) | Циклическая зависимость: предсказать вывод, затем устранить | Тест импортирует и проверяет порядок логов |
| `src/features/stats/index.js` | `loadStatsPanel()` — **динамический `import()`** панели статистики; кэширует модуль | Вызывается 1 раз → модуль загружен один раз |
| `docs/05-modules.md` | CommonJS vs ESM, live bindings, `import.meta`, top-level `await`, расширения в путях | — |

**Веха:** кнопка «Статистика» подгружает панель лениво (в Network виден отдельный чанк).

---

### Модуль 6. DOM и события
**Цель:** научить интерфейс реагировать. Здесь приложение оживает.

| Файл | Задание | Что проверяют тесты (jsdom) |
|------|---------|------------------------------|
| `src/ui/dom.js` | Хелпер `h(tag, props, ...children)`: атрибуты, `className`, `dataset`, `on*`-события, вложенные массивы детей, строки → text nodes; `clear(el)`; `qs/qsa` | Структура DOM, обработчики, отсутствие `innerHTML` |
| `src/playground/xssDemo.js` | Показать XSS через `innerHTML` с `<img onerror>`; безопасная версия через `textContent` | Тест: вредоносная строка не создаёт элемент `<img>` |
| `src/ui/TaskCard.js` | `renderTaskCard(task)` → `HTMLElement`: заголовок, теги, приоритет (CSS-класс), дедлайн (просрочено — красным), кнопки `✎`/`✕`; `data-id` | Разметка, классы, `data-id`, экранирование |
| `src/ui/Board.js` | `renderBoard(root, tasksByStatus)` — три колонки; **делегирование событий**: один обработчик на `root`, `event.target.closest('[data-action]')` → `onAction({ type, id })` | Клик на вложенный элемент срабатывает; количество listener'ов не растёт с числом карточек |
| `src/ui/Modal.js` | `openModal({ title, content })` → `{ close, closed: Promise }`; закрытие по `Esc`, клику по фону, кнопке; фокус-ловушка; возврат фокуса; `aria-*` | `Esc`, возврат фокуса, `closed` резолвится, удаление из DOM |
| `src/ui/TaskForm.js` | `renderTaskForm({ task?, onSubmit, onCancel })`; чтение через `FormData`; валидация из модуля 1 с показом ошибок; `preventDefault` | Сабмит с валидными/невалидными данными, подсветка полей |
| `src/ui/Toast.js` | `showToast(message, { type, timeout })`; очередь; автоскрытие | Fake timers |
| `src/playground/eventsQuiz.js` | Всплытие/перехват, `stopPropagation`, `preventDefault`, `{ once, capture, passive }`, `currentTarget` vs `target` | Порядок вызова обработчиков |

**Рефакторинг:** `main.js` подписывает `Store` на перерисовку доски (`renderBoard`) — «стейт → UI».

**Веха:** можно создать/редактировать/удалить задачу через модалку; доска перерисовывается при изменении `Store`.

**Ловушки:** `NodeList` ≠ массив; `innerHTML` и XSS; потеря обработчиков при перерисовке; `addEventListener` с `bind` не удаляется; `this` в обработчике.

---

### Модуль 7. Асинхронность
**Цель:** понять event loop и уверенно писать `async/await`.

| Файл | Задание | Что проверяют тесты |
|------|---------|---------------------|
| `src/playground/eventLoopQuiz.js` | 6 фрагментов с `setTimeout(0)`, `Promise.then`, `queueMicrotask`, `async` — **предсказать порядок вывода**, затем запустить | Сверка с реальным порядком |
| `src/utils/async.js` | `sleep(ms)`; `withTimeout(promise, ms)` (`Promise.race`, бросает `TimeoutError`); `retry(fn, { retries, delayMs, factor, shouldRetry })` — экспоненциальный backoff; `promisify(cbFn)`; `runSequential(tasks)` vs `runParallel(tasks, limit)` | Fake timers, число попыток, остановка по `shouldRetry`, лимит параллелизма |
| `src/api/client.js` | `request(url, { method, body, signal, timeoutMs })` поверх `fakeFetch`: JSON-сериализация, проверка `response.ok`, маппинг в `NetworkError`/`NotFoundError`, отмена через `AbortController` | Ошибки по статус-кодам, отмена |
| `src/api/taskApi.js` | `fetchTasks()`, `createTask(data)`, `updateTask(id, patch)`, `deleteTask(id)` — с `retry` для идемпотентных запросов | Мок `fakeFetch` (детерминированный режим сервера без случайных ошибок) |
| `src/api/sync.js` | `loadInitialData()` — `Promise.allSettled` для задач и (фиктивных) настроек, частичный успех; `optimisticUpdate(store, optimisticFn, apiCall)` — применить сразу, при ошибке **откатить** и показать toast | Откат при ошибке, финальное состояние при успехе |
| `src/playground/asyncPitfalls.js` | `forEach` + `await`; забытый `await`; `await` в цикле vs `Promise.all`; необработанный reject; `async` в `constructor` невозможен | Исправленные версии |
| `src/features/search/liveSearch.js` | Поиск с `debounce` из модуля 2 + отмена предыдущего запроса через `AbortController` (гонки запросов) | Устаревший ответ не перезаписывает свежий |

**Веха:** при старте — спиннер, затем загрузка с «сервера»; сохранение задач с оптимистичным UI; при сбое — откат и toast.

**Ловушки:** unhandled rejection, `async` всегда возвращает Promise, `return await` в `try/catch`, `Promise.all` падает целиком, микро- vs макротаски.

---

### Модуль 8. Хранилище и сериализация

| Файл | Задание | Что проверяют тесты |
|------|---------|---------------------|
| `src/storage/localStorageAdapter.js` | `createStorage(key, { storage = localStorage })` → `{ load(), save(value), clear() }`; `try/catch` на повреждённый JSON и переполнение квоты | Повреждённый JSON → значение по умолчанию; подмена `storage` в тесте |
| `src/storage/migrations.js` | Версионирование схемы: `migrate(data)` проводит `v1 → v2 → v3` (v1: без `tags`; v2: `dueDate` как timestamp; v3: ISO-строки и `updatedAt`) | Цепочка миграций, идемпотентность, неизвестная версия |
| `src/storage/serialization.js` | `serializeTasks(tasks)` / `deserializeTasks(json)` с `reviver` (даты), `toJSON`; проблемы `JSON.stringify` (`undefined`, `Date`, `Map`, циклы) | `Map/Set` через `replacer/reviver`, цикл → понятная ошибка |
| `src/playground/jsonPitfalls.js` | Что теряется при `JSON.stringify`/`parse` | Предсказания |

**Веха:** задачи кэшируются локально: при перезагрузке доска появляется мгновенно, затем синхронизируется с «сервером» (stale-while-revalidate).

---

### Модуль 9. Состояние и архитектура
**Цель:** паттерн «reducer», на котором стоят Redux и `useReducer`.

| Файл | Задание | Что проверяют тесты |
|------|---------|---------------------|
| `src/state/reducer.js` | `reducer(state, action)` — действия `TASKS_LOADED`, `TASK_ADDED`, `TASK_UPDATED`, `TASK_REMOVED`, `TASK_MOVED`, `FILTER_CHANGED`; используется `taskOps` из модуля 3 | Чистота, неизвестное действие возвращает **тот же объект state** |
| `src/state/store.js` | Эволюция `Store` из модуля 4: `createStore(reducer, initialState)` → `{ getState, dispatch, subscribe }`; поддержка middleware-цепочки `(store) => (next) => (action) => ...` | Порядок middleware, отписка |
| `src/state/middleware.js` | `logger`, `persist` (в `localStorage`), `asyncThunk` (`dispatch(fn)`, где `fn(dispatch, getState)`) | Вызовы, порядок |
| `src/state/history.js` | `withHistory(reducer, { limit = 50 })` — HOC над reducer: `past/present/future`, действия `UNDO`/`REDO`; `canUndo(state)`/`canRedo(state)` | Лимит, очистка `future` при новом действии |
| `src/state/selectors.js` | `selectVisibleTasks(state)`, `selectStats(state)`, `selectTags(state)` — с **мемоизацией** через `memoize`/собственный `createSelector` | Одинаковый ввод → тот же ссылочный результат; вызовов вычисления ровно 1 |

**Рефакторинг:** UI из модуля 6 теперь использует `dispatch` вместо прямых вызовов `setState`; горячие клавиши `Ctrl+Z` / `Ctrl+Shift+Z`.

**Веха:** работают Undo/Redo, фильтры, всё состояние в одном store.

---

### Модуль 10. Продвинутые возможности

| Файл | Задание | Что проверяют тесты |
|------|---------|---------------------|
| `src/features/search/queryParser.js` | `parseQuery('tag:work priority:high !done "buy milk" due:<2026-12-01')` → `{ tags, priority, status, excludeStatus, text, dueBefore }`; regex с **именованными группами**, `matchAll`, флаги `gi` | Таблица тест-кейсов (10+), кавычки, пустая строка |
| `src/utils/intl.js` | `formatDate(iso, locale)` (`Intl.DateTimeFormat`); `formatRelative(iso, now)` → «через 3 дня» / «вчера» (`Intl.RelativeTimeFormat`); `pluralizeTasks(n)` для `ru` (`Intl.PluralRules`: 1 задача, 2 задачи, 5 задач) | Русские формы для 0, 1, 2, 5, 11, 21, 101 |
| `src/features/pagination.js` | Генераторы: `function* paginate(items, size)`; `function* range(start, end, step)`; ленивый `take/map/filter` над итераторами | Лениость (генератор не вычисляет лишнего), `return`/`throw` |
| `src/features/dnd.js` | Drag & Drop API: `enableDragAndDrop(boardEl, onMove)` — `dragstart/dragover/drop`, подсветка колонки, `dataTransfer` | jsdom-события; вызов `onMove({ id, status })` |
| `src/features/observable.js` (**бонус**) | `observable(obj, onChange)` через `Proxy` + `Reflect`: глубокое отслеживание изменений | Нотификации на `set`/`deleteProperty`, массивы |
| `src/playground/symbolsAndWeakMap.js` | `Symbol` как ключ, `WeakMap` для приватных данных/кэша, `WeakRef` (по желанию) | Тесты на сборку не нужны — только поведение API |

**Веха:** строка поиска понимает синтаксис `tag:work !done`, даты и плюрализация на русском, карточки перетаскиваются между колонками.

---

### Модуль 11. Качество и типизация (мост к TypeScript)
**Цель:** привыкнуть к типам до TypeScript.

| Задание | Описание |
|---------|----------|
| JSDoc-типы | Во всех `src/domain`, `src/state`, `src/api` проверить/дополнить `@typedef`, `@param`, `@returns`, `@template T` (аналог generics), `@callback`, union-типы, литеральные типы |
| `// @ts-check` | Включить `checkJs` в `jsconfig.json`; студент исправляет найденные редактором ошибки (агент оставляет в коде 5–8 **намеренных** типовых ошибок с пометкой `// FIXME(11.x)`) |
| `npm run typecheck` | Скрипт: `npx -y -p typescript tsc -p jsconfig.json --noEmit` (TypeScript не добавляется в зависимости проекта) |
| ESLint | Правила: `no-var`, `prefer-const`, `eqeqeq`, `no-unused-vars`, `no-floating-promises`-аналог (`require-await`, `no-async-promise-executor`) — студент чинит замечания |
| Prettier | `npm run format` |
| Отладка | `docs/11-debugging.md`: breakpoints, watch, async call stack, performance, Network throttling; **упражнение**: в приложение агент закладывает 3 бага (мутация state, потерянный `this`, гонка запросов) — студент находит их по описанным симптомам (`docs/11-bug-hunt.md`) |

**Тесты:** `tests/m11/bughunt.test.js` — по одному тесту на баг; `tests/m11/jsdoc.test.js` — проверяет, что у экспортируемых функций из `src/domain` есть JSDoc (простой парсер по регулярке).

---

### Модуль 12. Мини-React (capstone)
**Цель:** понять, как устроены компоненты, состояние и хуки «под капотом».

| Файл | Задание | Что проверяют тесты |
|------|---------|---------------------|
| `src/mini-react/createElement.js` | `h(type, props, ...children)` → vnode `{ type, props, children }`; `type` — строка или функция-компонент; нормализация детей | Структура vnode, плоский список детей |
| `src/mini-react/render.js` | `render(vnode, container)`: vnode → реальный DOM; события `onClick` → `addEventListener`; вызов функциональных компонентов; **простая стратегия обновления:** полная перерисовка контейнера | Рендер вложенных компонентов, атрибуты, события |
| `src/mini-react/hooks.js` | `useState(initial)` и `useEffect(fn, deps)` на глобальном «курсоре» хуков; `rerender()` при `setState`; очистка эффекта; сравнение `deps` через `Object.is` | Счётчик-компонент; эффект вызывается ровно по `deps`; cleanup |
| `src/mini-react/components/` | `TaskCard`, `Column`, `Board`, `SearchBar`, `App` как функции `props => vnode` | Рендер `App` с тестовым store |
| `src/mini-react/useStore.js` | Хук подписки на `Store`/`createStore` (`useSyncExternalStore`-подобный) | Перерисовка при `dispatch` |
| `src/main.mini-react.js` | Точка входа второй версии приложения: UI целиком на мини-React; **студент сравнивает** с императивной версией из модуля 6 и заполняет `docs/12-reflection.md` (что стало проще/хуже) | — |

**Правила хуков (в заданиях):** почему нельзя вызывать хуки в `if`/циклах (нужно показать, как это ломает «курсор»), почему `setState` с мутацией не работает, зачем `key` (бонус: список с `key`).

**Веха:** то же приложение, но весь UI описан функциями-компонентами; студент видит `useState` и `useEffect` «изнутри».

---

## Часть 4. Итоговые документы

### 4.1. `README.md`
Разделы: цель курса; быстрый старт (`npm i`, `npm run dev`, `npm test`); как проходить (`npx vitest run tests/m03`); как пользоваться подсказками и квизами; правила честной работы (решения в `solutions/` — только после попытки); таблица модулей (из части 1); FAQ по типичным ошибкам окружения.

### 4.2. `PROGRESS.md`
Чеклист по всем упражнениям (`- [ ] 3.2 taskOps`), по строке на файл. `scripts/progress.js` печатает: `Модуль 3: 14/18 тестов ✓` и общий прогресс.

### 4.3. `docs/99-bridge-to-react-ts.md`
Таблица соответствия:

| Что изучено в курсе | Где встретится в React/TS |
|---|---|
| Деструктуризация, rest/spread | `props`, `{ children, ...rest }`, обновление state |
| `map/filter/reduce` | Рендер списков, производные данные |
| Иммутабельность (модуль 3, 9) | `setState`, `useReducer`, `React.memo` |
| Замыкания (модуль 2) | Хуки, stale closure в `useEffect`/`useCallback` |
| `this` и стрелки (модуль 4) | Почему в React стрелочные обработчики |
| ES-модули, dynamic `import()` | Структура проекта, `React.lazy` |
| `async/await`, `AbortController` | Загрузка данных в эффектах, гонки запросов |
| reducer/dispatch (модуль 9) | `useReducer`, Redux Toolkit |
| JSDoc/`@typedef`/`@template` (модуль 11) | `type`, `interface`, generics в TS |
| `h()`/vnode/`useState` (модуль 12) | Как работают JSX и хуки |

---

## Часть 5. Критерии готовности (Definition of Done для агента)

- [ ] Репозиторий создан по структуре из п. 2.3, `npm install && npm run dev` работают без ошибок.
- [ ] Все учебные файлы содержат шапку по шаблону 0.2, заглушки и JSDoc-сигнатуры.
- [ ] Для каждого модуля есть: `docs/NN-*.md`, `quizzes/NN-*.md`, тесты `tests/mNN/`, раздел в `PROGRESS.md`.
- [ ] `solutions/` содержит рабочие решения для **всех** упражнений.
- [ ] `node scripts/verify-solutions.js` → **все тесты зелёные**; на чистом `src/` тесты падают только на `TODO`-ошибках (не на синтаксисе/импортах).
- [ ] `fakeServer.js`, `index.html`, `styles.css` готовы и работают.
- [ ] Готовое приложение (с решениями) запускается, демонстрирует все вехи модулей 1–12, в консоли нет ошибок.
- [ ] `npm run lint` и `npm run typecheck` проходят на версии с решениями.
- [ ] `README.md`, `PROGRESS.md`, `docs/99-bridge-to-react-ts.md` написаны.

### Рекомендуемый порядок работы агента
1. Скелет: `package.json`, Vite/Vitest/ESLint, `index.html`, `styles.css`, `fakeServer.js`.
2. Для каждого модуля 0→12 по очереди: **сначала решение** (`solutions/`) и тесты → убедиться, что зелёные → сгенерировать заглушки в `src/` с заданиями → шпаргалка + квиз.
3. Собрать `main.js` и `main.mini-react.js`, проверить вехи вручную (или через jsdom-смоук-тест).
4. Финальный прогон `verify-solutions`, lint, typecheck; дописать README и PROGRESS.
