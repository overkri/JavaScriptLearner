# 05 · ES-модули

> Модуль 5: упражнения `src/core/index.js`, `src/domain/index.js`, `src/playground/cycleDemo/`,
> `src/features/stats/index.js`.
>
> **Тесты модуля:** `npx vitest run tests/m05` · [папка тестов](../tests/m05)

## CommonJS и ESM

В проекте `package.json` содержит `"type": "module"`, поэтому все `.js` — ES-модули. CommonJS
(`.cjs` или отдельный пакет) использует `require()` и `module.exports`, ESM — `import`/`export`.

| | CommonJS | ESM |
|---|---|---|
| Загрузка | синхронная, во время выполнения | граф связывается до вычисления, загрузка асинхронная |
| Значения | при деструктуризации копируется текущее значение | live bindings: импорт видит обновления экспорта |
| `await` на верхнем уровне | нельзя | можно (top-level await) |
| Разрешение путей | расширения необязательны | в Node — обязательны |

`require` внутри ESM даёт `ReferenceError: require is not defined`; используйте `import` или `.cjs`.

## Named, default и barrel

```js
// domain/index.js — default и named указывают на одну функцию
export { createTask as default, createTask, updateTask, isOverdue } from './task.js';
export * from './taskOps.js';

// потребитель
import createTask, { createTask as named, updateTask } from './domain/index.js';
```

- `default` — это всего лишь экспорт с именем `default`; в модуле он может быть только один.
- `export *` реэкспортирует **именованные** экспорты и не включает `default`.
- Barrel (`core/index.js`, `domain/index.js`) удобен для потребителя, но внутри модулей лучше импортировать
  конкретные файлы: меньше риск цикла и лишней загрузки.
- `import * as domain from './domain/index.js'` даёт namespace-объект, где `domain.default` — default-экспорт.

## Динамический `import()`

```js
let modulePromise;

export function loadStatsPanel() {
  modulePromise ??= import('./panel.js'); // Promise<namespace>
  return modulePromise;
}
```

`import()` вызывается в рантайме и возвращает промис; Vite выносит `panel.js` в отдельный чанк.
Кэшировать нужно **промис**, а не результат `await`: два параллельных вызова иначе запустят загрузку дважды,
и тест `lazyStats.test.js` проверит, что `loadStatsPanel()` вернул один и тот же промис.
`resetStatsPanel()` сбрасывает кэш только для тестов.

## Циклические зависимости

`cycleDemo/a.js` и `b.js` импортируют друг друга. ESM сначала связывает модули, затем вычисляет их тела.
Безопасно обращаться к импорту **внутри функции**, которая вызовется после инициализации:

```js
export function describeCycle() {
  return `${a.name}->${b.name}`; // ок: вызов после загрузки обоих модулей
}
```

Обращение на верхнем уровне (`const text = \`${a.name}->${b.name}\``) может попасть в TDZ и дать
`ReferenceError: Cannot access 'b' before initialization`. В Java циклические зависимости классов — тоже
признак проблемного дизайна, но там они обычно ломают компиляцию/загрузку иначе.

## `import.meta` и top-level await

- `import.meta.url` — URL текущего модуля; в Node путь получают через `fileURLToPath(import.meta.url)`.
- В Vite доступны `import.meta.env.DEV`, `import.meta.env.PROD`, `import.meta.env.BASE_URL`.
- `await` на верхнем уровне разрешён только в ESM: импортирующий модуль ждёт завершения. Тяжёлый TLA
  задерживает всю цепочку импорта, а в цикле может привести к взаимной блокировке.

## Расширения в путях

В отличие от classpath Java, относительный импорт — это URL: `import { Store } from './Store.js'`.
Node ESM и нативный браузерный ESM **не** добавляют `.js` и не ищут `index.js` в папке автоматически.
Vite часто прощает пропущенное расширение, но в курсе пишем явно: `./core/index.js`, `./EventEmitter.js`.
Импорт из пакета (`vitest`) разрешается через `node_modules`.

## Java → JS

| Java | JavaScript |
|---|---|
| `package` + `import` класса | относительный путь к файлу с расширением `.js` |
| classpath и иерархия пакетов | `node_modules` + резолвер Vite/Node; `index.js` не подразумевается |
| `public static` члены класса | named exports; `default` — один «главный» экспорт |
| `Class.forName(...)` / рефлексия | динамический `import()` → `Promise` с namespace |
| Порядок инициализации классов | циклы разрешены, но возможен TDZ; TLA задерживает импортёров |

## Ловушки

1. **`require` в ESM.** При `"type": "module"` его нет; используйте `import` или переименуйте файл в `.cjs`.
2. **Забытое расширение.** `import './panel'` в Node ESM даст `ERR_MODULE_NOT_FOUND`; нужно `./panel.js`.
3. **Ожидание «снимка» от default.** `export default theme` фиксирует значение в момент выполнения,
   а named-импорт `theme` — live binding и увидит последующее изменение.
4. **Цикл + верхний уровень.** Значение второго модуля ещё в TDZ; переносите обращение внутрь функции.
5. **Динамический импорт без кэша промиса.** Параллельные вызовы создают несколько цепочек загрузки;
   кэшируйте `modulePromise` через `??=`.
