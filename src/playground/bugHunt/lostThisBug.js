/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 11 · УПРАЖНЕНИЕ 11.2 — Bug hunt: потерянный this
 * ═══════════════════════════════════════════════════════════
 *  Симптом: кнопка «+1» работает, если вызвать counter.increment(),
 *  но падает, когда обработчик передают колбэком:
 *    const { increment } = counter;
 *    increment(); // TypeError: Cannot read properties of undefined
 *  Тесты:   npx vitest run tests/m11/bughunt.test.js
 *  Уровень: ★★☆
 *
 *  ЗАДАНИЕ
 *  Исправьте потерю this, сохранив API: increment можно вызывать
 *  отдельно от объекта, счётчик должен увеличиваться.
 *  Подсказка: замыкание, стрелка или bind.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @returns {{ state: { count: number }, increment: () => void }}
 */
export function createCounterBug() {
  const state = { count: 0 };
  return {
    state,
    // FIXME(11.2): this теряется при передаче метода как колбэка.
    increment() {
      this.state.count += 1;
    },
  };
}
