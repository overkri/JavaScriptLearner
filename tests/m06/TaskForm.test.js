// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderTaskForm } from '../../src/ui/TaskForm.js';

afterEach(() => {
  document.body.replaceChildren();
});

/** @param {HTMLFormElement} form */
function submit(form) {
  const event = new Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(event);
  return event;
}

/** @param {Record<string, any>} overrides */
function makeTask(overrides = {}) {
  return {
    id: 't1',
    title: 'Старое имя',
    description: 'Описание',
    status: 'todo',
    priority: 'high',
    tags: ['work', 'home'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    dueDate: '2026-12-01',
    ...overrides,
  };
}

describe('renderTaskForm', () => {
  it('renders all fields and prefills them from a task', () => {
    const form = renderTaskForm({ task: makeTask() });
    expect(form.tagName).toBe('FORM');
    expect(form.elements.namedItem('title').value).toBe('Старое имя');
    expect(form.elements.namedItem('description').value).toBe('Описание');
    expect(form.elements.namedItem('priority').value).toBe('high');
    expect(form.elements.namedItem('tags').value).toBe('work, home');
    expect(form.elements.namedItem('dueDate').value).toBe('2026-12-01');
    expect(form.querySelector('button[type="submit"]').textContent).toBe('Сохранить');
  });

  it('submits normalized data and prevents the default action', () => {
    const onSubmit = vi.fn();
    const form = renderTaskForm({ onSubmit });
    form.elements.namedItem('title').value = '  Новая задача  ';
    form.elements.namedItem('description').value = 'Описание';
    form.elements.namedItem('priority').value = 'low';
    form.elements.namedItem('tags').value = ' Work, home, work ';
    form.elements.namedItem('dueDate').value = '2026-12-31';

    const event = submit(form);
    expect(event.defaultPrevented).toBe(true);
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Новая задача',
      description: 'Описание',
      priority: 'low',
      tags: ['work', 'home'],
      dueDate: '2026-12-31',
    });
  });

  it('sends null when the due date is empty', () => {
    const onSubmit = vi.fn();
    const form = renderTaskForm({ onSubmit });
    form.elements.namedItem('title').value = 'Task';
    submit(form);
    expect(onSubmit.mock.calls[0][0].dueDate).toBeNull();
  });

  it('shows a title error and blocks submit for an empty title', () => {
    const onSubmit = vi.fn();
    const form = renderTaskForm({ onSubmit });
    form.elements.namedItem('title').value = '   ';
    submit(form);

    expect(onSubmit).not.toHaveBeenCalled();
    const error = form.querySelector('[data-error-for="title"]');
    expect(error.textContent.length).toBeGreaterThan(0);
    expect(form.querySelector('[data-field="title"]').classList.contains('field--invalid')).toBe(
      true,
    );
  });

  it('shows a due date error for an impossible date', () => {
    const onSubmit = vi.fn();
    const form = renderTaskForm({ onSubmit });
    form.elements.namedItem('title').value = 'Task';
    // Значение date-input в jsdom может не принять 2026-02-30, поэтому
    // подменяем имя поля на текстовый ввод.
    const input = form.elements.namedItem('dueDate');
    input.type = 'text';
    input.value = '2026-02-30';
    submit(form);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(form.querySelector('[data-error-for="dueDate"]').textContent.length).toBeGreaterThan(0);
  });

  it('calls onCancel from the cancel button', () => {
    const onCancel = vi.fn();
    const form = renderTaskForm({ onCancel });
    [...form.querySelectorAll('button')].find((button) => button.textContent === 'Отмена').click();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('clears a previous error after a successful submit', () => {
    const onSubmit = vi.fn();
    const form = renderTaskForm({ onSubmit });
    form.elements.namedItem('title').value = '';
    submit(form);
    expect(form.querySelector('[data-error-for="title"]').textContent.length).toBeGreaterThan(0);

    form.elements.namedItem('title').value = 'Fixed';
    submit(form);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(form.querySelector('[data-error-for="title"]').textContent).toBe('');
  });
});
