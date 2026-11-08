// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderTaskCard } from '../../src/ui/TaskCard.js';

/** @param {Record<string, any>} overrides */
function makeTask(overrides = {}) {
  return {
    id: 'task-1',
    title: 'Купить молоко',
    description: 'Два литра',
    status: 'todo',
    priority: 'high',
    tags: ['home', 'shopping'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    dueDate: null,
    ...overrides,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 5, 15, 12, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('renderTaskCard', () => {
  it('renders the card structure and data attributes', () => {
    const card = renderTaskCard(makeTask());
    expect(card.tagName).toBe('ARTICLE');
    expect(card.classList.contains('task-card')).toBe(true);
    expect(card.classList.contains('priority-high')).toBe(true);
    expect(card.dataset.id).toBe('task-1');
    expect(card.getAttribute('draggable')).toBe('true');
    expect(card.querySelector('.task-card__title').textContent).toBe('Купить молоко');
    expect(card.querySelector('.task-card__description').textContent).toBe('Два литра');
    expect(card.querySelector('.task-card__priority').textContent).toBe('high');
  });

  it('renders tags with # prefixes', () => {
    const card = renderTaskCard(makeTask());
    expect([...card.querySelectorAll('.tag')].map((tag) => tag.textContent)).toEqual([
      '#home',
      '#shopping',
    ]);
  });

  it('renders the due date and marks overdue tasks', () => {
    const overdue = renderTaskCard(makeTask({ dueDate: '2026-06-01' }));
    const due = overdue.querySelector('.task-card__due');
    expect(due.textContent).toContain('2026-06-01');
    expect(due.classList.contains('is-overdue')).toBe(true);

    const future = renderTaskCard(makeTask({ dueDate: '2026-12-01' }));
    expect(future.querySelector('.task-card__due').classList.contains('is-overdue')).toBe(false);

    const none = renderTaskCard(makeTask());
    expect(none.querySelector('.task-card__due').textContent).toBe('без срока');
  });

  it('does not mark done tasks as overdue', () => {
    const card = renderTaskCard(makeTask({ status: 'done', dueDate: '2026-06-01' }));
    expect(card.querySelector('.task-card__due').classList.contains('is-overdue')).toBe(false);
  });

  it('adds edit and delete buttons with action and id', () => {
    const card = renderTaskCard(makeTask());
    const edit = card.querySelector('[data-action="edit"]');
    const remove = card.querySelector('[data-action="delete"]');
    expect(edit.dataset.id).toBe('task-1');
    expect(remove.dataset.id).toBe('task-1');
    expect(edit.getAttribute('aria-label')).toBeTruthy();
    expect(remove.getAttribute('aria-label')).toBeTruthy();
  });

  it('escapes the title (no HTML injection)', () => {
    const payload = '<img src=x onerror="window.hacked=true">';
    const card = renderTaskCard(makeTask({ title: payload }));
    expect(card.querySelector('img')).toBeNull();
    expect(card.querySelector('.task-card__title').textContent).toBe(payload);
  });
});
