/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 6 · УПРАЖНЕНИЕ 6.5 — Форма задачи
 * ═══════════════════════════════════════════════════════════
 *  Тема:           формы, FormData, preventDefault, валидация
 *  Java-аналогия:  форма + Bean Validation; ошибки показываем рядом
 *  Тесты:          npx vitest run tests/m06/TaskForm.test.js   (jsdom)
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  renderTaskForm({ task?, onSubmit, onCancel }) → HTMLFormElement.
 *  Поля (name): title, description, priority (select), tags, dueDate.
 *  Требования:
 *  - если task передан — поля заполнены его значениями;
 *  - submit всегда вызывает preventDefault;
 *  - читайте значения через new FormData(form);
 *  - валидируйте title и dueDate функциями из utils/validators.js;
 *  - при ошибке onSubmit НЕ вызывается, у .field появляется класс
 *    field--invalid, а в [data-error-for="..."] — текст ошибки;
 *  - при успехе onSubmit получает:
 *    { title, description, priority, tags: string[], dueDate: string|null };
 *    title trim'ится, tags режутся по запятой и очищаются;
 *  - кнопка «Отмена» вызывает onCancel.
 *
 *  ПОДСКАЗКА
 *  form.addEventListener('submit', (event) => {
 *    event.preventDefault();
 *    ...
 *  });
 *  Не полагайтесь на required браузера: тест вызывает submit напрямую.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {import('../domain/task.js').Task} Task
 * @typedef {{ title: string, description: string, priority: string, tags: string[], dueDate: string|null }} TaskFormData
 */

/**
 * @param {{ task?: Task|null, onSubmit?: (data: TaskFormData) => void, onCancel?: () => void }} [options]
 * @returns {HTMLFormElement}
 */
export function renderTaskForm(options = {}) {
  throw new Error('TODO 6.5: not implemented');
}
