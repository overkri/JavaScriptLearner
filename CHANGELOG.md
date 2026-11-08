# Changelog

Все заметные изменения проекта **TaskFlow — курс JavaScript для Java-разработчика**.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/).
Проект следует [Semantic Versioning 2.0.0](https://semver.org/lang/ru/).
Правила версионирования — в разделе «Версионирование» [README.md](./README.md).

## [Unreleased]

_Планируемые изменения следующего выпуска._

## [1.0.0] — 2026-11-08

Первый стабильный выпуск курса: 13 модулей, полноценное приложение TaskFlow,
capstone на мини-React, эталонные решения, тесты, документация и квизы.

### Added

- Полная структура курса: модули 0–12, 74 учебных файла в `src/` и зеркальные
  эталоны в `solutions/src/`.
- 63 файла тестов и **439 тестов**: Node для логики, jsdom для DOM и мини-React.
- Модуль 0: окружение, Vite, Vitest, DevTools, REPL.
- Модуль 1: типы, сравнения, truthy/falsy, `?.`/`??`, форматирование,
  валидаторы, quiz-файлы.
- Модуль 2: `createIdGenerator`, `once`, `debounce`, `throttle`, `memoize`,
  `pipe`, `compose`, `curry`, `partial`, `tap`, `not`.
- Модуль 3: `Task`, иммутабельные `taskOps`, фильтры/сортировка, статистика,
  теги, kata на методы массивов, quiz про ссылки.
- Модуль 4: иерархия ошибок, `EventEmitter`, `Store`, `TaskList` с
  `Symbol.iterator`, quiz про `this` и прототипы.
- Модуль 5: barrel-файлы, циклические ESM-зависимости, ленивая загрузка панели
  статистики через dynamic `import()`.
- Модуль 6: `h()`, карточка задачи, доска с делегированием, модалка с
  focus trap, форма на `FormData`, toast-очередь, XSS-демо и quiz событий.
- Модуль 7: `sleep`, `withTimeout`, `retry`, `promisify`, последовательный и
  параллельный запуск, HTTP-клиент, task API, `allSettled` и оптимистичные
  обновления, event loop quiz, live search с `AbortController`.
- Модуль 8: адаптер `localStorage`, миграции схемы `v1 → v2 → v3`,
  сериализация `Date`/`Map`/`Set`, JSON-ловушки.
- Модуль 9: reducer, store с middleware, `logger`/`persist`/`asyncThunk`,
  undo/redo, мемоизированные селекторы.
- Модуль 10: парсер запросов с именованными группами regex, `Intl`-форматирование
  и плюрализация, генераторы и ленивые итераторы, Drag & Drop, `Proxy`, quiz
  про `Symbol`/`WeakMap`.
- Модуль 11: три намеренных бага для bug hunt, пять ошибок JSDoc для `checkJs`,
  ESLint/Prettier-настройка, документация по отладке.
- Модуль 12: `h()`, `render()`, хуки на курсоре, `useStore`, компоненты
  `TaskCard`/`Column`/`Board`/`SearchBar`/`App`, вторая точка входа
  `mini-react.html`.
- Готовое приложение TaskFlow: CRUD, поиск по синтаксису `tag:work !done`,
  фильтры, статистика, undo/redo, drag & drop, темы, кэш и fake-сервер с
  задержками, ошибками и `AbortSignal`.
- `index.html`, `mini-react.html`, `src/styles.css` со светлой/тёмной темой.
- `scripts/verify-solutions.js`, `scripts/verify-module.js`, `scripts/progress.js`.
- README, CHANGELOG, лицензия MIT.
- Документация: 17 файлов в `docs/` (включая мост к React/TS, отладку и
  bug hunt), 13 квизов в `quizzes/`.
- End-to-end smoke-тест приложения в jsdom.

### Changed

- `filterTasks` трактует `status: 'all'` и `priority: 'all'` как отсутствие
  фильтра.
- ESLint теперь проверяет и `solutions/`, а не только `src/` и `tests/`.
- Оптимистичное создание задачи заменяет локальную задачу серверной одним
  действием `TASK_UPDATED`, без промежуточного удаления.
- `loadInitialData` устойчив к загрузчикам, которые бросают исключение
  синхронно.
- Парсер запросов отклоняет несуществующие календарные даты (`2026-02-30`).
- Документация мини-React явно описывает синхронный запуск `useEffect` как
  учебное упрощение.
- Уточнено поведение `observable` при `push`: уведомление об индексе, без
  гарантированного отдельного `set` для `length`.

### Fixed

- `createStorage` использует `window.localStorage` как fallback, что чинит
  работу в jsdom/браузере при отсутствии глобального `localStorage`.
- Исправлены JSDoc-аннотации rest-параметров, из-за которых `tsc` видел
  неверные типы.
- Устранены ложные срабатывания `checkJs` в эталонах; `solutions/src` проходит
  проверку с `"checkJs": true`.
- Исправлены пути `@typedef` в playground-файлах.
- Убран шум от unhandled rejection в тестах при запуске на незаполненных
  заглушках.
- Мини-React `App` использует `h(SearchBar, ...)`, а не прямой вызов компонента.

### Security

- Пользовательские строки в приложении рендерятся через `textContent`;
  `innerHTML` используется только в намеренно небезопасном учебном
  `playground/xssDemo.js`.
- Fake-сервер поддерживает `AbortSignal`; клиент различает `AbortError`,
  timeout и HTTP-ошибки.

## Ссылки

- [README.md](./README.md) — быстрый старт и структура курса.
- [LICENSE](./LICENSE) — MIT.
