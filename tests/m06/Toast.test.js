// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearToasts, showToast } from '../../src/ui/Toast.js';

beforeEach(() => {
  vi.useFakeTimers();
  clearToasts();
  document.body.replaceChildren();
});

afterEach(() => {
  clearToasts();
  vi.useRealTimers();
});

describe('showToast', () => {
  it('shows a toast with the type class and text', () => {
    showToast('Сохранено', { type: 'success' });
    const toast = document.querySelector('.toast');
    expect(toast).not.toBeNull();
    expect(toast.classList.contains('toast--success')).toBe(true);
    expect(toast.textContent).toBe('Сохранено');
    expect(document.querySelector('#toast-root')).not.toBeNull();
  });

  it('auto-dismisses after the timeout', () => {
    showToast('Временное', { timeout: 1000 });
    expect(document.querySelectorAll('.toast')).toHaveLength(1);
    vi.advanceTimersByTime(999);
    expect(document.querySelectorAll('.toast')).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(document.querySelectorAll('.toast')).toHaveLength(0);
  });

  it('queues toasts and shows them one at a time', () => {
    showToast('First', { timeout: 1000 });
    showToast('Second', { timeout: 1000 });
    expect(document.querySelectorAll('.toast')).toHaveLength(1);
    expect(document.querySelector('.toast').textContent).toBe('First');

    vi.advanceTimersByTime(1000);
    expect(document.querySelectorAll('.toast')).toHaveLength(1);
    expect(document.querySelector('.toast').textContent).toBe('Second');

    vi.advanceTimersByTime(1000);
    expect(document.querySelectorAll('.toast')).toHaveLength(0);
  });

  it('returns a manual dismiss function for the active toast', () => {
    const dismiss = showToast('Bye', { timeout: 10000 });
    dismiss();
    expect(document.querySelectorAll('.toast')).toHaveLength(0);
  });

  it('does not render HTML from the message', () => {
    showToast('<img src=x onerror="window.hacked=true">');
    expect(document.querySelector('.toast img')).toBeNull();
    expect(document.querySelector('.toast').textContent).toContain('<img');
  });

  it('clearToasts removes the active toast and the queue', () => {
    showToast('One', { timeout: 10000 });
    showToast('Two', { timeout: 10000 });
    clearToasts();
    expect(document.querySelectorAll('.toast')).toHaveLength(0);
    vi.advanceTimersByTime(20000);
    expect(document.querySelectorAll('.toast')).toHaveLength(0);
  });
});
