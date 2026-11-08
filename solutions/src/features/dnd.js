/**
 * Эталон модуля 10.4 — Drag & Drop на делегировании.
 */

/**
 * @param {HTMLElement} boardEl
 * @param {(move: { id: string, status: string }) => void} onMove
 * @returns {() => void} cleanup
 */
export function enableDragAndDrop(boardEl, onMove) {
  /** @type {string|null} */
  let draggedId = null;

  const columns = () => [...boardEl.querySelectorAll('.board-column')];

  function clearDropTargets() {
    for (const column of columns()) column.classList.remove('drop-target');
  }

  /**
   * @param {Event} event
   * @returns {HTMLElement|null}
   */
  function closest(event, selector) {
    const target = event.target;
    return target instanceof Element ? /** @type {HTMLElement|null} */ (target.closest(selector)) : null;
  }

  /** @param {DragEvent} event */
  const onDragStart = (event) => {
    const card = closest(event, '[data-id]');
    if (!card || !boardEl.contains(card)) return;

    draggedId = card.dataset.id ?? null;
    if (!draggedId) return;

    event.dataTransfer?.setData('text/plain', draggedId);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    card.classList.add('dragging');
  };

  /** @param {DragEvent} event */
  const onDragOver = (event) => {
    const column = closest(event, '[data-status]');
    if (!column) return;

    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    clearDropTargets();
    column.classList.add('drop-target');
  };

  /** @param {DragEvent} event */
  const onDragLeave = (event) => {
    const column = closest(event, '[data-status]');
    if (!column) return;
    const related = /** @type {Node|null} */ (event.relatedTarget);
    if (!related || !column.contains(related)) {
      column.classList.remove('drop-target');
    }
  };

  /** @param {DragEvent} event */
  const onDrop = (event) => {
    const column = closest(event, '[data-status]');
    if (!column) return;

    event.preventDefault();
    const id = event.dataTransfer?.getData('text/plain') || draggedId;
    const status = column.dataset.status;

    clearDropTargets();
    for (const card of boardEl.querySelectorAll('.dragging')) {
      card.classList.remove('dragging');
    }
    draggedId = null;

    if (id && status) onMove({ id, status });
  };

  const onDragEnd = () => {
    clearDropTargets();
    for (const card of boardEl.querySelectorAll('.dragging')) {
      card.classList.remove('dragging');
    }
    draggedId = null;
  };

  boardEl.addEventListener('dragstart', onDragStart);
  boardEl.addEventListener('dragover', onDragOver);
  boardEl.addEventListener('dragleave', onDragLeave);
  boardEl.addEventListener('drop', onDrop);
  boardEl.addEventListener('dragend', onDragEnd);

  return () => {
    boardEl.removeEventListener('dragstart', onDragStart);
    boardEl.removeEventListener('dragover', onDragOver);
    boardEl.removeEventListener('dragleave', onDragLeave);
    boardEl.removeEventListener('drop', onDrop);
    boardEl.removeEventListener('dragend', onDragEnd);
    clearDropTargets();
    for (const card of boardEl.querySelectorAll('.dragging')) {
      card.classList.remove('dragging');
    }
    draggedId = null;
  };
}
