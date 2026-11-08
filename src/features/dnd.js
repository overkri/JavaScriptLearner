/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 10 · УПРАЖНЕНИЕ 10.4 — Drag & Drop
 * ═══════════════════════════════════════════════════════════
 *  Тема:           dragstart/dragover/drop, dataTransfer, делегирование
 *  Java-аналогия:  DnD в JavaFX: source/target + перенос data
 *  Тесты:          npx vitest run tests/m10/dnd.test.js   (jsdom)
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  enableDragAndDrop(boardEl, onMove) → cleanup.
 *  - dragstart на карточке [data-id]: запомнить id, dataTransfer
 *    setData('text/plain', id), effectAllowed='move',
 *    класс .dragging на карточке;
 *  - dragover над колонкой [data-status]: preventDefault,
 *    dropEffect='move', класс .drop-target на колонке (только на одной);
 *  - drop: preventDefault, взять id, вызвать onMove({ id, status }),
 *    убрать все подсветки;
 *  - dragend: убрать .dragging и подсветки, сбросить состояние;
 *  - вернуть функцию cleanup, снимающую ВСЕ обработчики.
 *
 *  ПОДСКАЗКА
 *  event.target.closest('[data-status]') находит колонку даже при
 *  броске на вложенный элемент. DataTransfer в jsdom может отсутствовать —
 *  используйте optional chaining и внутреннюю переменную draggedId.
 *
 *  ЛОВУШКА
 *  Без preventDefault в dragover браузер не разрешит drop.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @param {HTMLElement} boardEl
 * @param {(move: { id: string, status: string }) => void} onMove
 * @returns {() => void} cleanup
 */
export function enableDragAndDrop(boardEl, onMove) {
  throw new Error('TODO 10.4: not implemented');
}
