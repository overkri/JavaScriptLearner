# 06 · DOM и события

> Модуль 6: упражнения `src/ui/dom.js`, `TaskCard.js`, `Board.js`, `Modal.js`, `TaskForm.js`, `Toast.js`,
> `src/playground/xssDemo.js`, `src/playground/eventsQuiz.js`.
>
> **Тесты модуля:** `npx vitest run tests/m06` · [папка тестов](../tests/m06)

## Поиск и создание узлов

- `qs(selector, root)` — обёртка над `querySelector`; `qsa` возвращает **массив** (`NodeList` — не массив).
- `h(tag, props, ...children)` создаёт элемент: `className`, `dataset`, `style`, `on*`-события,
  boolean-атрибуты, вложенные массивы детей; строки и числа становятся текстовыми узлами.
- `clear(el)` удаляет всех детей; `replaceChildren()` — современная альтернатива.
- `h()` не использует `innerHTML`: пользовательские строки попадают в `textContent`/`createTextNode`.

## События: всплытие и перехват

Событие идёт `capture` → `target` → `bubble`. `addEventListener(type, handler, { capture, once, passive })`.

- `event.target` — где событие возникло; `event.currentTarget` — элемент, чей слушатель сейчас работает.
- В обычной функции `this === currentTarget`; стрелка своего `this` не даёт.
- `stopPropagation()` останавливает движение по дереву, но **не** отменяет действие браузера.
- `preventDefault()` отменяет действие по умолчанию; `event.defaultPrevented` покажет результат.
- `{ once: true }` снимает обработчик после первого вызова.

Демонстрации собираются в `eventsQuiz.js`: `runEventOrderDemo()` возвращает
`['outer-capture', 'inner', 'outer-bubble']`, `runStopPropagationDemo()` — `['inner']`.

## Делегирование

В `Board.js` `renderBoard(root, tasksByStatus, onAction)` рисует три колонки
`.board-column[data-status]` с карточками из `renderTaskCard`. На `root` висит **один** click-обработчик:

```js
const actionEl = event.target.closest('[data-action]');
if (actionEl) onAction({ type: actionEl.dataset.action, id: actionEl.dataset.id });
```

`closest` поднимается от вложенного элемента (иконки, `span`) до кнопки. Слушатель хранится в `WeakMap`,
поэтому повторный `renderBoard` не добавляет второй обработчик, а новый `onAction` начинает использоваться
сразу. Это решает и проблему «обработчики потерялись при перерисовке», и утечку слушателей.

`dataset` — это `data-*`-атрибуты: `data-task-id` ↔ `dataset.taskId`, `data-action` ↔ `dataset.action`.
Все значения — строки; удобно для делегирования, но не для чисел/объектов.

## Формы и `FormData`

`renderTaskForm({ task, onSubmit, onCancel })` создаёт поля `title`, `description`, `priority`, `tags`, `dueDate`.
На `submit` всегда вызывается `event.preventDefault()` (иначе браузер перезагрузит страницу), значения читаются
через `new FormData(form)` или `form.elements.namedItem(name)`. `FormData` отдаёт **сырые строки**:
`title` нужно trim'ить, `tags` — резать по запятой, приводить к нижнему регистру и убирать дубли,
пустой `dueDate` — превращать в `null`.
Валидация — вручную через `validateTitle`/`validateDueDate` из `utils/validators.js`: при ошибке
`onSubmit` не вызывается, у `.field` появляется `field--invalid`, а в `[data-error-for="title"]` — текст.
Не полагайтесь на `required` браузера: тест вызывает `submit` напрямую.

## XSS

`innerHTML` **парсит** строку как HTML: `<img src=x onerror="...">` создаёт элемент и может выполнить код.
`textContent` и `createTextNode` вставляют данные как текст и экранируют разметку.
`xssDemo.js`: `renderUnsafe` использует `innerHTML` (намеренно), `renderSafe` — `textContent`.
Правило TaskFlow: любые `task.title`, `description`, `tags`, сообщения toast — только текстом.
Опасны также `href="javascript:..."`, `srcdoc` и вставка HTML из «доверенного» API.

## Модалка и доступность

`openModal({ title, content })` создаёт `.modal-backdrop` и `.modal` с `role="dialog"`, `aria-modal="true"`,
`aria-labelledby` (id заголовка). Закрытие — кнопка `[data-action="close"]`, `Esc`, клик по фону (не по окну).
Фокус-ловушка: `Tab`/`Shift+Tab` зациклены между первым и последним focusable-элементом внутри диалога.
После закрытия фокус возвращается на элемент, который был активен до открытия; `close()` идемпотентен,
`closed` — промис, который резолвится один раз. `Toast.js` показывает уведомления по очереди через `#toast-root`
и автоскрывает их по `timeout`.

## Java → JS

| Java | JavaScript |
|---|---|
| Swing/JavaFX-дерево компонентов | DOM-дерево узлов; `document.createElement` |
| `button.addActionListener(listener)` | `addEventListener(type, fn)`; обработчиков может быть много |
| Прямой вызов слушателя | фазы capture → target → bubble по дереву |
| `getElementById`, обход компонентов | `querySelector`/`querySelectorAll` с CSS-селекторами |
| Bean binding формы + валидация | `FormData` (строки) + ручная нормализация и валидация |
| Экранирование в шаблонизаторе | `textContent`/`createTextNode`, а не `innerHTML` |

## Ловушки

1. **`innerHTML` с данными пользователя.** Это XSS; для текста — `textContent`, для узлов — `h()`/`createElement`.
2. **Слушатели на каждой карточке.** При перерисовке они теряются или дублируются; делегируйте на стабильный `root`.
3. **`NodeList` — не массив.** У него нет `map/filter`; `qsa` возвращает массив, иначе используйте `[...list]`.
4. **Забытый `preventDefault()`.** Форма перезагружает страницу, ссылка уводит с неё; `stopPropagation` здесь не помогает.
5. **`target` вместо `currentTarget`.** В делегировании `target` — вложенная иконка; `closest` и `currentTarget` надёжнее.
