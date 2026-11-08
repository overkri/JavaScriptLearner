# Мост к React + TypeScript

Курс намеренно построен на «ручном» JavaScript: всё, что React скрывает, здесь
приходится делать самим. Ниже — карта соответствия.

| Что изучено в курсе | Где встретится в React/TS |
|---|---|
| Деструктуризация, rest/spread (модули 2–3) | `props`, `{ children, ...rest }`, обновление state |
| `map/filter/reduce` (модуль 3) | рендер списков, производные данные, `useMemo` |
| Иммутабельность (модули 3, 9) | `setState`, `useReducer`, `React.memo`, сравнение ссылок |
| Замыкания (модуль 2) | хуки, stale closure в `useEffect`/`useCallback` |
| `this` и стрелки (модуль 4) | почему обработчики в React обычно стрелочные |
| ES-модули, dynamic `import()` (модуль 5) | структура проекта, `React.lazy`, code splitting |
| `async/await`, `AbortController` (модуль 7) | загрузка данных в эффектах, отмена гонок |
| reducer/dispatch (модуль 9) | `useReducer`, Redux Toolkit, Zustand-подобные store |
| JSDoc/`@typedef`/`@template` (модуль 11) | `type`, `interface`, generics в TS |
| `h()`/vnode/`useState` (модуль 12) | как работают JSX и хуки «под капотом» |
| `EventEmitter`/`Store` (модуль 4) | внешние store, `useSyncExternalStore` |
| `Promise.allSettled`, оптимистичный UI (модуль 7) | React Query/SWR, optimistic mutations |
| Drag & Drop API (модуль 10) | dnd-kit, react-beautiful-dnd |
| `Intl` (модуль 10) | локализация интерфейса, `react-intl` |
| XSS и `textContent` (модуль 6) | `dangerouslySetInnerHTML` — почему его избегают |

## Что переносится напрямую

1. **Иммутабельные операции** — в React `state` меняется только новым объектом.
   `{ ...task, title }`, `tasks.map`, `tasks.filter` — это 80% работы с состоянием.
2. **Композиция функций** — `pipe`, `memoize`, селекторы превращаются в
   `useMemo`/`useCallback` и `createSelector`.
3. **Функции-компоненты** — `props → vnode` из модуля 12 буквально становится
   `props → JSX`.
4. **Хуки** — правила «только на верхнем уровне, в фиксированном порядке»
   объясняются устройством курсора хуков из модуля 12.
5. **Асинхронность** — `AbortController` и отмена устаревших запросов обязательны
   в `useEffect`.

## Что в React будет иначе

- Вместо ручного `render()` — декларативный JSX и виртуальный DOM с
  согласованием (reconciliation).
- Вместо `addEventListener` — пропсы `onClick`, `onChange`, синтетические события.
- Вместо `createStore` — `useState`, `useReducer`, контекст или внешняя библиотека.
- Вместо `document.querySelector` — `ref` (`useRef`).
- TypeScript добавляет проверку типов на этапе компиляции; JSDoc-привычки
  (`@typedef`, `@param`, `@returns`, `@template`) почти один-в-один
  превращаются в `type`, `interface`, generics.

## Практический мост

Попробуйте переписать `src/mini-react/components/App.js` на React:

```jsx
function App({ store }) {
  const state = useStore(store);
  const visible = useMemo(() => selectVisibleTasks(state), [state]);
  return <Board tasksByStatus={groupByStatus(visible)} />;
}
```

Затем добавьте TypeScript: опишите `Task`, `Status`, `Priority` и `TaskFilter`
через `type`, а `selectVisibleTasks` — через generic `createSelector`.
Вы увидите, что структура кода почти не изменилась — изменилась только
проверка типов.
