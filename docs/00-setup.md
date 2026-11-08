# 00 · Старт и инструменты

**Цель модуля:** запустить TaskFlow, освоить npm, Vite, Vitest, REPL и DevTools.
Файлы модуля: `src/playground/hello.js`, `tests/m00/smoke.test.js`.

## Быстрый старт

```bash
npm install        # зависимости из package.json
npm run dev        # Vite: обычно http://localhost:5173
npm test           # Vitest: один прогон всех тестов
npm run test:watch # тесты в режиме наблюдения
```

Только тесты модуля 0:

```bash
npx vitest run tests/m00/smoke.test.js
```

Vite — dev-сервер и сборщик, а не компилятор в байт-код: он отдаёт `index.html`, преобразует ES-модули и обновляет страницу при изменениях. `npm run build` собирает статику в `dist/`.

## Node vs браузер

Оба окружения исполняют JavaScript, но дают разные API. Node ≥ 20 умеет `process`, `fs`, `path`, `crypto.randomUUID`; в браузере есть `window`, `document`, `localStorage`, DevTools. Общий глобальный объект — `globalThis`. Тесты логики идут в Node, DOM-тесты помечаются `// @vitest-environment jsdom`.

## npm vs Maven/Gradle

| Java / Maven          | JavaScript / TaskFlow                                            |
| --------------------- | ---------------------------------------------------------------- |
| JDK, `java` / `javac` | Node.js ≥ 20 исполняет JS; браузер — второй рантайм              |
| Maven / Gradle        | npm (`package.json`, `package-lock.json`)                        |
| `pom.xml`             | `package.json`: `scripts`, `devDependencies`, `"type": "module"` |
| `src/main/java`       | `src/`                                                           |
| JUnit                 | Vitest (`tests/m00/smoke.test.js`)                               |
| `System.out.println`  | `console.log`                                                    |

`package.json` описывает проект и команды; `package-lock.json` фиксирует точные версии зависимостей и вручную не редактируется. `"type": "module"` включает ESM-синтаксис `import/export` для `.js`-файлов.

## DevTools

- **Console** — `console.log`, `console.table`, `console.dir`, `console.error`, `console.group`, `console.time`. Ошибка в консоли не останавливает программу.
- **Sources** — `Ctrl+P` открывает файл, клик по номеру строки ставит breakpoint; справа видно call stack и значения переменных.
- **Network** — статусы, заголовки и тела запросов; позже здесь появятся ленивые чанки и запросы к «серверу».

## REPL

В терминале выполните `node` — откроется интерактивная консоль. Вводите выражения (`2 + 2`, `const x = 1`) и получайте результат сразу; `.exit` или двойной `Ctrl+C` — выход. В браузере ту же роль играет Console, но там доступен DOM. REPL ничего не сохраняет в файл и не подходит для запуска приложения целиком.

## Веха

После `npm run dev` открывается статичная канбан-доска из `index.html`: колонки «К выполнению», «В работе», «Готово» и карточки. Пока модули не готовы, `main.js` может вывести предупреждение, но статичная разметка остаётся на экране.

## Типичные ловушки

1. Открыть `index.html` двойным щелчком: страница работает по `file://`, ES-модули и `fetch` блокируются — нужен `npm run dev`.
2. Запустить `npm install` или `npm test` не из корня проекта: npm не найдёт `package.json`.
3. Использовать Node старее 20: проверьте `node -v` (в `package.json` указано `>=20`).
4. Занят порт 5173: Vite выберет следующий и напишет адрес в терминале — смотрите вывод команды.
5. Смешать среды: `document` в Node или `process`/`fs` в браузере дадут `ReferenceError`.

## Проверка

```bash
npx vitest run tests/m00/smoke.test.js
```

До реализации `greet` тест падает с `TODO 0.1: not implemented` — это ожидаемо. Квиз: [quizzes/00-setup.md](../quizzes/00-setup.md).
