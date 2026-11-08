/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 7 · УПРАЖНЕНИЕ 7.5 — Quiz: порядок в event loop
 * ═══════════════════════════════════════════════════════════
 *  Тема:           call stack, microtasks, macrotasks, async/await
 *  Java-аналогия:  в Java нет event loop; порядок определяет планировщик
 *  Тесты:          npx vitest run tests/m07/eventLoopQuiz.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  Для каждого фрагмента запишите порядок строк в predictions.
 *  Тест выполнит реальный код и сравнит массивы.
 *  Ключи:
 *    syncPromiseTimeout   — sync, Promise.then, setTimeout(0)
 *    asyncAwait           — async-функция с await null
 *    microtasksBeforeTimers — then-цепочка + queueMicrotask + два timeout
 *    microtaskOrder       — Promise.then vs queueMicrotask
 *    asyncIife            — async IIFE и await
 *    nestedMicrotask      — queueMicrotask внутри then
 *
 *  ПОДСКАЗКИ
 *  - Сначала синхронный код, затем ВСЕ микрозадачи (then, queueMicrotask,
 *    продолжения после await), затем макрозадачи (setTimeout).
 *  - await всегда уступает управление, даже для уже готового значения.
 * ═══════════════════════════════════════════════════════════
 */

/** @type {Record<string, string[]>} */
export const predictions = {
  // TODO 7.5: заполните 6 массивов
};
