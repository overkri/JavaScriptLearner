# TaskFlow — JavaScript для Java-разработчика

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](./CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/node-%E2%89%A520-brightgreen.svg)](https://nodejs.org/)

Учебный репозиторий-тренажёр: вы последовательно выполняете упражнения на чистом
JavaScript, и из них собирается рабочее приложение **TaskFlow** — канбан-доска задач.
Курс рассчитан на опытного Java-разработчика, который хочет подготовиться к
**React + TypeScript** и понять, «как это работает под капотом».

- Никаких фреймворков и рантайм-зависимостей.
- Только ES2022+, ES-модули, `const`/`let`.
- Node.js ≥ 20, Vite, Vitest, jsdom, ESLint, Prettier.
- 13 модулей, 60+ упражнений, **439 тестов**, эталонные решения, документация и квизы.
- Текущая версия: **1.0.0** (SemVer 2.0.0).

Полезные документы:

| Документ | Назначение |
|---|---|
| [CHANGELOG.md](./CHANGELOG.md) | история изменений по версиям |
| [docs/](./docs/) | шпаргалки по модулям, отладка и мост к React/TS |
| [quizzes/](./quizzes/) | квизы с ответами в `<details>` |
| [LICENSE](./LICENSE) | MIT |

---

## Быстрый старт

```bash
npm install
npm run dev      # http://localhost:5173 — статичная доска
npm test         # все тесты (на старте падают на TODO — это нормально)
```

Полезные команды:

| Команда | Что делает |
|---|---|
| `npm run dev` | Vite dev-server с горячей перезагрузкой |
| `npm test` | все тесты один раз |
| `npm run test:watch` | тесты в watch-режиме |
| `npm run test:m -- m03` | тесты только модуля 3 (или `npx vitest run tests/m03`) |
| `npm run progress` | прогресс по модулям по результатам тестов |
| `npm run verify` | все тесты на эталонах `solutions/src` во временной папке |
| `npm run verify:m -- m03` | тесты одного модуля на эталонах |
| `npm run lint` | ESLint (`src`, `tests`, `scripts`, `solutions`) |
| `npm run format` | Prettier |
| `npm run typecheck` | `tsc --noEmit` по `jsconfig.json` |
| `npm run build` | production-сборка Vite (две страницы) |
| `npm run preview` | просмотр собранной версии |

Вторая версия приложения на мини-React доступна по адресу
`http://localhost:5173/mini-react.html` (после модуля 12; в production-сборке —
`dist/mini-react.html`).

---

## Как проходить курс

1. Запустите `npm run progress` — команда покажет, сколько тестов каждого модуля
   уже проходит.
2. Читайте шапку файла в `src/` — там задание, требования, подсказки и ловушка.
3. Запускайте тесты конкретного модуля:
   ```bash
   npx vitest run tests/m01
   ```
4. Добейтесь зелёных тестов. Падение с `TODO …: not implemented` означает, что
   упражнение ещё не реализовано; другие ошибки — сигнал разобраться.
5. Смотрите веху модуля в браузере (`npm run dev`).
6. После самостоятельной попытки сверяйтесь с `solutions/`.
7. Пройдите квиз из `quizzes/NN-*.md` — ответы спрятаны в `<details>`.

### Правила честной работы

- `solutions/` — **только после попытки**. Иначе курс превращается в перепечатывание.
- Не копируйте решения в `src/` целиком: сначала объясните себе каждую строку.
- Подсказки в шапке файла раскрывайте по одной.
- Если тест непонятен, прочитайте его — он описывает ожидаемое поведение.

---

## Модули

| № | Модуль | Ключевые темы | Время | Веха в приложении |
|---|--------|---------------|-------|-------------------|
| 0 | Старт и инструменты | Node, npm, Vite, Vitest, DevTools, REPL | 1–2 ч | Открывается статичная доска |
| 1 | Основы языка | типы, `let/const`, `==` vs `===`, truthy/falsy, `?.`, `??`, строки | 3–4 ч | Форматирование задач |
| 2 | Функции и замыкания | arrow, default/rest, callback, closure, `debounce`, `memoize`, `pipe` | 4–5 ч | Утилиты приложения |
| 3 | Объекты и массивы | деструктуризация, spread, `map/filter/reduce`, `Map/Set`, иммутабельность | 5–6 ч | CRUD, фильтры, статистика |
| 4 | `this`, прототипы, классы | `this`, `bind`, прототипы, `class`, `#private`, `Symbol.iterator`, ошибки | 4–5 ч | `EventEmitter`, `Store`, `TaskList` |
| 5 | ES-модули | `import/export`, barrel, dynamic `import()`, циклы | 2 ч | Ленивая статистика |
| 6 | DOM и события | `querySelector`, делегирование, всплытие, формы, XSS | 6–7 ч | **Доска оживает** |
| 7 | Асинхронность | event loop, Promise, `async/await`, `allSettled`, `AbortController`, retry | 6–7 ч | Загрузка/сохранение, лоадеры |
| 8 | Хранилище и сериализация | JSON, `localStorage`, версии схемы, миграции, `Date` | 2–3 ч | Данные переживают перезагрузку |
| 9 | Состояние и архитектура | reducer, middleware, selectors, undo/redo | 4–5 ч | Undo/Redo, единый store |
| 10 | Продвинутые возможности | regex, `Intl`, генераторы, DnD, `Proxy` | 4–5 ч | Поиск `tag:work !done`, DnD |
| 11 | Качество и типизация | JSDoc + `@ts-check`, ESLint, Prettier, отладка | 2–3 ч | Проект проходит typecheck |
| 12 | Мини-React (capstone) | `h()`, vnode, компоненты, `useState`, `useEffect` | 6–8 ч | UI на собственных компонентах |

После модуля 12 прочитайте `docs/99-bridge-to-react-ts.md` — карту перехода к React/TS.

---

## Структура репозитория

```
├─ README.md            # этот файл
├─ CHANGELOG.md         # история версий
├─ LICENSE              # MIT
├─ package.json         # scripts, devDependencies, version 1.0.0
├─ vite.config.js       # Vite + Vitest, две HTML-точки входа
├─ eslint.config.js
├─ jsconfig.json        # checkJs выключается/включается в модуле 11
├─ index.html           # оболочка TaskFlow
├─ mini-react.html      # оболочка capstone-версии
├─ docs/                # шпаргалки 00..12 + отладка, bug hunt, рефлексия, мост к React
├─ quizzes/             # квизы 00..12 с ответами в <details>
├─ scripts/             # verify-solutions, verify-module, progress
├─ src/                 # упражнения-заглушки и готовые части приложения
│  ├─ domain/           # Task, taskOps, stats, tags, TaskList, priority
│  ├─ utils/            # format, validators, id, functional, async, intl
│  ├─ core/             # EventEmitter, Store, errors, barrel
│  ├─ state/            # reducer, store, middleware, history, selectors
│  ├─ ui/               # dom, TaskCard, Board, Modal, TaskForm, Toast
│  ├─ api/              # fakeServer (готов), client, taskApi, sync
│  ├─ storage/          # localStorageAdapter, migrations, serialization
│  ├─ features/         # stats, search, pagination, dnd, observable
│  ├─ playground/       # квизы, kata, bug hunt, type errors
│  ├─ mini-react/       # capstone: h, render, hooks, components
│  ├─ main.js           # императивная версия UI (готова)
│  └─ main.mini-react.js# версия на мини-React (готова)
├─ solutions/src/       # эталонные решения (зеркало src)
└─ tests/
   ├─ m00 ... m12/      # тесты по модулям
   └─ app/              # end-to-end smoke-тест приложения
```

---

## Как устроены упражнения

Каждый учебный файл содержит:

- шапку с номером модуля, темой, Java-аналогией, командой тестов и уровнем;
- задание и требования;
- подсказки;
- ловушку — типичную ошибку новичка;
- JSDoc-сигнатуры (подготовка к TypeScript);
- заглушки, которые бросают `Error('TODO …: not implemented')`.

Исключения: квизы-данные (`answers`/`predictions`), barrel-файлы и намеренно
сломанные файлы `src/playground/bugHunt/`, которые нужно исправить в модуле 11.

Готовые части (`index.html`, `mini-react.html`, `src/styles.css`,
`src/api/fakeServer.js`, `src/main.js`, `src/main.mini-react.js`,
`src/features/stats/panel.js`, `src/vite-env.d.ts`) можно читать, но не нужно
менять.

### Fake-сервер

`src/api/fakeServer.js` — настоящий `Response`-совместимый in-memory бэкенд:
задержка 200–800 мс, 15% случайных ошибок `500`, поддержка `AbortSignal`.
В тестах он детерминирован:

```js
import { createFakeServer } from '../src/api/fakeServer.js';
const server = createFakeServer({ latency: [0, 0], errorRate: 0 });
```

---

## Состояние проекта

Проверено на версии **1.0.0**:

| Проверка | Результат |
|---|---|
| `npm run verify` | 63 файла, **439 тестов зелёные** |
| `npm run lint` | 0 ошибок |
| `npm run typecheck` | 0 ошибок (`checkJs: false`; эталоны чисты и при `checkJs: true`) |
| `npm run build` | успешно, `index.html` и `mini-react.html` |
| `npm run dev` | обе страницы отдаются, приложение работает |
| `tests/app/smoke.test.js` | загрузка задач, форма, поиск, статистика |

На чистом `src/` тесты намеренно красные: это стартовое состояние курса.
Красные тесты в `bugHunt` и квизах — часть задания, а не поломка окружения.

---

## Версионирование

Проект следует **Semantic Versioning 2.0.0**:

- **MAJOR** — несовместимые изменения контрактов упражнений, структуры или Node.js;
- **MINOR** — новые модули, упражнения, тесты, квизы и обратно совместимые API;
- **PATCH** — исправления решений, тестов, документации и приложения без смены контракта.

Текущая версия — `1.0.0`. История изменений — в [CHANGELOG.md](./CHANGELOG.md).

---

## Типичные вопросы

**Тесты падают сразу после `npm install` — это ошибка?**
Нет. В `src/` лежат заглушки с `TODO`, поэтому тесты красные. Начните с модуля 0.

**Почему тесты падают не с `TODO`, а с `AssertionError`?**
Скорее всего, упражнение уже частично реализовано, но поведение отличается от
требований. Читайте сообщение теста и шапку файла.

**Где решения?**
`solutions/src/...` — зеркальная структура. `npm run verify` прогоняет все тесты
на эталонах во временной папке, не трогая ваш `src/`.

**Как проверить только один тест?**
```bash
npx vitest run tests/m03/taskOps.test.js -t "does not mutate"
```

**Почему в браузере иногда «Не удалось загрузить задачи»?**
Fake-сервер намеренно ошибается в 15% случаев. Повторите действие — retry и
кнопка обновления помогут. Это часть упражнений модуля 7.

**Почему `npm run typecheck` ничего не проверяет?**
В `jsconfig.json` по умолчанию `"checkJs": false` — так задумано. Включите его
в модуле 11 и исправьте ошибки JSDoc. Эталоны проходят и с `checkJs: true`.

**Нужен ли TypeScript?**
Нет, он не в зависимостях проекта. Скрипт `typecheck` вызывает `tsc` через `npx`.

**Как узнать, что уже готово?**
Запустите `npm run progress` — скрипт сгруппирует результаты тестов по модулям
и покажет, сколько упражнений пройдено.

---

## Лицензия

Проект распространяется по лицензии **MIT**. См. [LICENSE](./LICENSE).

Вайб — [Vibe Coding License 1.0](./VIBE.md): это манифест, а не лицензия. Код остаётся под MIT.

Copyright (c) 2026 TaskFlow JS Course contributors.
