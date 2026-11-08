/**
 * Эталон модуля 6.5 — форма создания/редактирования задачи.
 */

import { validateDueDate, validateTitle } from '../utils/validators.js';
import { h } from './dom.js';

/**
 * @typedef {import('../domain/task.js').Task} Task
 * @typedef {{ title: string, description: string, priority: string, tags: string[], dueDate: string|null }} TaskFormData
 */

/**
 * @param {string} name
 * @param {string} label
 * @param {HTMLElement} control
 * @returns {HTMLElement}
 */
function field(name, label, control) {
  return h(
    'div',
    { className: 'field', dataset: { field: name } },
    h('label', { className: 'field__label', htmlFor: control.id }, label),
    control,
    h('p', { className: 'field__error', dataset: { errorFor: name } }, ''),
  );
}

/**
 * @param {{ task?: Task|null, onSubmit?: (data: TaskFormData) => void, onCancel?: () => void }} [options]
 * @returns {HTMLFormElement}
 */
export function renderTaskForm({ task = null, onSubmit, onCancel } = {}) {
  const titleInput = h('input', {
    id: 'task-title',
    name: 'title',
    className: 'field__control',
    type: 'text',
    maxlength: '80',
    value: task?.title ?? '',
    placeholder: 'Например, купить молоко',
  });

  const descriptionInput = h(
    'textarea',
    {
      id: 'task-description',
      name: 'description',
      className: 'field__control',
      rows: '3',
      placeholder: 'Детали задачи',
    },
    task?.description ?? '',
  );

  const prioritySelect = /** @type {HTMLSelectElement} */ (
    h('select', {
      id: 'task-priority',
      name: 'priority',
      className: 'field__control',
    })
  );
  for (const priority of ['low', 'medium', 'high']) {
    prioritySelect.append(h('option', { value: priority }, priority));
  }
  prioritySelect.value = task?.priority ?? 'medium';

  const tagsInput = h('input', {
    id: 'task-tags',
    name: 'tags',
    className: 'field__control',
    type: 'text',
    value: (task?.tags ?? []).join(', '),
    placeholder: 'work, home',
  });

  const dueDateInput = h('input', {
    id: 'task-due-date',
    name: 'dueDate',
    className: 'field__control',
    type: 'date',
    value: task?.dueDate ?? '',
  });

  const submitButton = h(
    'button',
    { type: 'submit', className: 'button button--primary' },
    task ? 'Сохранить' : 'Создать',
  );
  const cancelButton = h('button', { type: 'button', className: 'button' }, 'Отмена');

  const form = /** @type {HTMLFormElement} */ (
    h(
      'form',
      { className: 'task-form', novalidate: true },
      field('title', 'Заголовок', titleInput),
      field('description', 'Описание', descriptionInput),
      field('priority', 'Приоритет', prioritySelect),
      field('tags', 'Теги (через запятую)', tagsInput),
      field('dueDate', 'Дедлайн', dueDateInput),
      h('div', { className: 'form-actions' }, cancelButton, submitButton),
    )
  );

  /**
   * @param {string} name
   * @param {string} message
   */
  function setError(name, message) {
    const wrapper = form.querySelector(`[data-field="${name}"]`);
    const error = form.querySelector(`[data-error-for="${name}"]`);
    wrapper?.classList.toggle('field--invalid', Boolean(message));
    if (error) error.textContent = message;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const title = String(data.get('title') ?? '');
    const dueDate = String(data.get('dueDate') ?? '') || null;

    setError('title', '');
    setError('dueDate', '');

    const titleResult = validateTitle(title);
    if (!titleResult.ok) {
      setError('title', titleResult.error ?? 'Некорректный заголовок');
      titleInput.focus();
      return;
    }

    const dueResult = validateDueDate(dueDate);
    if (!dueResult.ok) {
      setError('dueDate', dueResult.error ?? 'Некорректная дата');
      dueDateInput.focus();
      return;
    }

    const tags = [
      ...new Set(
        String(data.get('tags') ?? '')
          .split(',')
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    ];

    onSubmit?.({
      title: title.trim(),
      description: String(data.get('description') ?? ''),
      priority: String(data.get('priority') ?? 'medium'),
      tags,
      dueDate,
    });
  });

  cancelButton.addEventListener('click', () => onCancel?.());

  return form;
}
