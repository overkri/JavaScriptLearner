/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 12 · УПРАЖНЕНИЕ 12.2 — useState и useEffect
 * ═══════════════════════════════════════════════════════════
 *  Тема:           глобальный курсор хуков, замыкания, deps, cleanup
 *  Java-аналогия:  поля компонента + listener lifecycle, но порядок
 *                  вызовов хуков фиксирован
 *  Тесты:          npx vitest run tests/m12/hooks.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  Реализуйте хуки на «курсоре» (массив слотов на компонент):
 *  1. useState(initial) → [value, setState].
 *     - initial может быть функцией (вызвать один раз);
 *     - setState принимает значение или updater(prev);
 *     - Object.is(prev, next) → rerender НЕ вызывается;
 *     - иначе обновить слот и вызвать rerender.
 *  2. useEffect(fn, deps).
 *     - без deps — после каждого рендера;
 *     - deps сравниваются через Object.is поэлементно;
 *     - перед повторным запуском вызывается cleanup предыдущего эффекта.
 *  3. beginRender/beginComponent/endComponent/configureHooks — служебные,
 *     их использует render.js. Не меняйте сигнатуры.
 *  4. resetHooks() — очистка для тестов (и «размонтирования»).
 *
 *  ПОДСКАЗКА
 *  Слоты храните в Map<componentIndex, slots[]>. hookIndex
 *  сбрасывается в beginComponent. В useState замыкание на slot
 *  переживает перерисовки.
 *
 *  ЛОВУШКА
 *  Хуки нельзя вызывать в if/циклах: меняется порядок слотов, и
 *  useState начнёт читать чужое состояние. Это правило React.
 * ═══════════════════════════════════════════════════════════
 */

// TODO 12.2: здесь понадобятся Map слотов, индексы и функция rerender.
// const componentSlots = new Map();
// let componentIndex = 0;
// let currentSlots = null;
// let hookIndex = 0;
// let rerender = () => {};

/**
 * @param {{ rerender: () => void }} config
 */
export function configureHooks(config) {
  throw new Error('TODO 12.2.1: not implemented');
}

export function beginRender() {
  throw new Error('TODO 12.2.2: not implemented');
}

export function beginComponent() {
  throw new Error('TODO 12.2.3: not implemented');
}

export function endComponent() {
  throw new Error('TODO 12.2.4: not implemented');
}

/** Сброс всех слотов и cleanup эффектов. */
export function resetHooks() {
  // TODO 12.2.5: очистите слоты и вызовите cleanup
}

/**
 * @template T
 * @param {T|(() => T)} initial
 * @returns {[T, (next: T|((previous: T) => T)) => void]}
 */
export function useState(initial) {
  throw new Error('TODO 12.2.6: not implemented');
}

/**
 * @param {() => void|(() => void)} effect
 * @param {any[]} [deps]
 */
export function useEffect(effect, deps) {
  throw new Error('TODO 12.2.7: not implemented');
}
