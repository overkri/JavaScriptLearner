/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 6 · УПРАЖНЕНИЕ 6.6 — Toast-уведомления
 * ═══════════════════════════════════════════════════════════
 *  Тема:           очередь, setTimeout, auto-dismiss, DOM
 *  Java-аналогия:  очередь сообщений; показываем по одному
 *  Тесты:          npx vitest run tests/m06/Toast.test.js   (jsdom)
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  showToast(message, { type = 'info', timeout = 3000 }) —
 *  показывает уведомление в контейнере #toast-root (создайте, если нет):
 *  - элемент .toast.toast--{type}, текст через textContent;
 *  - уведомления показываются ПО ОДНОМУ: следующее появляется,
 *    когда предыдущее исчезло;
 *  - через timeout миллисекунд уведомление удаляется;
 *  - верните функцию ручного закрытия;
 *  - clearToasts() очищает очередь и активное уведомление
 *    (пригодится в тестах и при разлогине).
 *
 *  ПОДСКАЗКА
 *  Держите queue: Array, active: HTMLElement|null, timer.
 *  При закрытии активного вызывайте showNext().
 *
 *  ЛОВУШКА
 *  Если показывать все сразу, несколько ошибок наложатся друг на
 *  друга. Очередь — часть UX.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @param {string} message
 * @param {{ type?: 'info'|'success'|'error'|'warning', timeout?: number }} [options]
 * @returns {() => void} dismiss
 */
export function showToast(message, options = {}) {
  throw new Error('TODO 6.6: not implemented');
}

/** Убирает все уведомления и очередь. */
export function clearToasts() {
  throw new Error('TODO 6.6b: not implemented');
}
