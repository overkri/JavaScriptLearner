/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 6 · УПРАЖНЕНИЕ 6.4 — Модальное окно
 * ═══════════════════════════════════════════════════════════
 *  Тема:           focus trap, keyboard events, aria, Promise
 *  Java-аналогия:  Dialog из Swing/JavaFX, но управление фокусом руками
 *  Тесты:          npx vitest run tests/m06/Modal.test.js   (jsdom)
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  openModal({ title, content }) → { close, closed: Promise }.
 *  Требования:
 *  - overlay .modal-backdrop и .modal[role="dialog"][aria-modal];
 *  - title связан с dialog через aria-labelledby;
 *  - content: Node вставляется как есть, строка — через textContent;
 *  - закрытие: кнопка, Esc, клик по фону (не по окну);
 *  - focus trap по Tab/Shift+Tab внутри окна;
 *  - после закрытия фокус возвращается на прежний элемент;
 *  - окно удаляется из DOM, closed резолвится один раз;
 *  - close() идемпотентен.
 *
 *  ПОДСКАЗКА
 *  Слушатель keydown вешайте на document, Tab обрабатывайте вручную:
 *  первый/последний focusable зацикливаются.
 *
 *  ЛОВУШКА
 *  Без возврата фокуса пользователь с клавиатуры «теряется» после
 *  закрытия диалога. Это требование доступности (a11y).
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @param {{ title?: string, content?: Node|string|null, closeOnBackdrop?: boolean }} options
 * @returns {{ close: () => void, closed: Promise<void> }}
 */
export function openModal(options) {
  throw new Error('TODO 6.4: not implemented');
}
