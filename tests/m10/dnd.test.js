// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { enableDragAndDrop } from '../../src/features/dnd.js';
import { h } from '../../src/ui/dom.js';

/** @returns {{ data: Map<string, string>, setData: (format: string, value: string) => void, getData: (format: string) => string, effectAllowed: string, dropEffect: string }} */
function createDataTransfer() {
  const data = new Map();
  return {
    data,
    effectAllowed: '',
    dropEffect: '',
    setData(format, value) {
      data.set(format, value);
    },
    getData(format) {
      return data.get(format) ?? '';
    },
  };
}

/** @param {string} type @param {EventTarget} target @param {any} [dataTransfer] */
function dispatchDrag(type, target, dataTransfer = createDataTransfer()) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });
  target.dispatchEvent(event);
  return { event, dataTransfer };
}

/** @type {HTMLElement} */
let board;
/** @type {HTMLElement} */
let card;
/** @type {HTMLElement} */
let doneColumn;

beforeEach(() => {
  document.body.replaceChildren();
  board = h(
    'section',
    { id: 'board' },
    h(
      'section',
      { className: 'board-column', dataset: { status: 'todo' } },
      h('article', {
        className: 'task-card',
        dataset: { id: 't1' },
        draggable: 'true',
      }),
    ),
    h(
      'section',
      { className: 'board-column', dataset: { status: 'done' } },
      h('div', { className: 'column-cards' }),
    ),
  );
  document.body.append(board);
  card = board.querySelector('[data-id="t1"]');
  doneColumn = board.querySelector('[data-status="done"]');
});

describe('enableDragAndDrop', () => {
  it('moves a card to another column on drop', () => {
    const onMove = vi.fn();
    enableDragAndDrop(board, onMove);

    const { dataTransfer } = dispatchDrag('dragstart', card);
    expect(dataTransfer.getData('text/plain')).toBe('t1');
    expect(card.classList.contains('dragging')).toBe(true);

    const nested = doneColumn.querySelector('.column-cards');
    const over = dispatchDrag('dragover', nested, dataTransfer);
    expect(over.event.defaultPrevented).toBe(true);
    expect(doneColumn.classList.contains('drop-target')).toBe(true);
    expect(board.querySelectorAll('.drop-target')).toHaveLength(1);

    dispatchDrag('drop', nested, dataTransfer);
    expect(onMove).toHaveBeenCalledWith({ id: 't1', status: 'done' });
    expect(card.classList.contains('dragging')).toBe(false);
    expect(board.querySelectorAll('.drop-target')).toHaveLength(0);
  });

  it('ignores drops outside a column', () => {
    const onMove = vi.fn();
    enableDragAndDrop(board, onMove);
    dispatchDrag('dragstart', card);
    dispatchDrag('drop', board, createDataTransfer());
    expect(onMove).not.toHaveBeenCalled();
  });

  it('cleans up highlights on dragend', () => {
    enableDragAndDrop(board, vi.fn());
    const { dataTransfer } = dispatchDrag('dragstart', card);
    dispatchDrag('dragover', doneColumn, dataTransfer);
    dispatchDrag('dragend', card, dataTransfer);
    expect(card.classList.contains('dragging')).toBe(false);
    expect(doneColumn.classList.contains('drop-target')).toBe(false);
  });

  it('removes all listeners in cleanup', () => {
    const onMove = vi.fn();
    const cleanup = enableDragAndDrop(board, onMove);
    cleanup();

    const { dataTransfer } = dispatchDrag('dragstart', card);
    expect(card.classList.contains('dragging')).toBe(false);
    dispatchDrag('drop', doneColumn, dataTransfer);
    expect(onMove).not.toHaveBeenCalled();
  });
});
