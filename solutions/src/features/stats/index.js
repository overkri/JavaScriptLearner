/**
 * Эталон модуля 5.4 — ленивый dynamic import с кэшем промиса.
 */

/** @type {Promise<typeof import('./panel.js')>|null} */
let modulePromise = null;

/**
 * Загружает панель статистики лениво (один раз).
 * @returns {Promise<typeof import('./panel.js')>}
 */
export function loadStatsPanel() {
  modulePromise ??= import('./panel.js');
  return modulePromise;
}

/** Сбрасывает кэш. Нужен только тестам. */
export function resetStatsPanel() {
  modulePromise = null;
}
