/**
 * Эталон модуля 6.7 — XSS demo.
 */

/**
 * ВНИМАНИЕ: намеренно небезопасно, только для демонстрации.
 * @param {HTMLElement} container
 * @param {string} userInput
 * @returns {HTMLElement}
 */
export function renderUnsafe(container, userInput) {
  container.innerHTML = `<p class="xss">${userInput}</p>`;
  return container;
}

/**
 * @param {HTMLElement} container
 * @param {string} userInput
 * @returns {HTMLElement}
 */
export function renderSafe(container, userInput) {
  container.replaceChildren();
  const paragraph = document.createElement('p');
  paragraph.className = 'xss';
  paragraph.textContent = userInput;
  container.append(paragraph);
  return container;
}
