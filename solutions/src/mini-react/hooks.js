/**
 * Эталон модуля 12.2 — хуки.
 */

/** @type {Map<number, any[]>} */
const componentSlots = new Map();
let componentIndex = 0;
/** @type {any[]|null} */
let currentSlots = null;
let hookIndex = 0;
/** @type {() => void} */
let rerender = () => {};

/**
 * @param {{ rerender: () => void }} config
 */
export function configureHooks(config) {
  rerender = config.rerender;
}

export function beginRender() {
  componentIndex = 0;
}

export function beginComponent() {
  const id = componentIndex;
  componentIndex += 1;
  if (!componentSlots.has(id)) componentSlots.set(id, []);
  currentSlots = /** @type {any[]} */ (componentSlots.get(id));
  hookIndex = 0;
}

export function endComponent() {
  currentSlots = null;
}

/** Сброс всех слотов и cleanup эффектов. */
export function resetHooks() {
  for (const slots of componentSlots.values()) {
    for (const slot of slots) {
      if (slot?.cleanup) slot.cleanup();
    }
  }
  componentSlots.clear();
  componentIndex = 0;
  currentSlots = null;
  hookIndex = 0;
}

/**
 * @template T
 * @param {T|(() => T)} initial
 * @returns {[T, (next: T|((previous: T) => T)) => void]}
 */
export function useState(initial) {
  if (!currentSlots) throw new Error('useState must be called inside a component');

  const index = hookIndex;
  hookIndex += 1;

  if (!(index in currentSlots)) {
    currentSlots[index] = {
      kind: 'state',
      value: typeof initial === 'function' ? /** @type {() => T} */ (initial)() : initial,
    };
  }

  const slot = currentSlots[index];

  const setState = (next) => {
    const value = typeof next === 'function' ? /** @type {(previous: T) => T} */ (next)(slot.value) : next;
    if (Object.is(value, slot.value)) return;
    slot.value = value;
    rerender();
  };

  return [slot.value, setState];
}

/**
 * @param {() => void|(() => void)} effect
 * @param {any[]} [deps]
 */
export function useEffect(effect, deps) {
  if (!currentSlots) throw new Error('useEffect must be called inside a component');

  const index = hookIndex;
  hookIndex += 1;

  const previous = currentSlots[index];
  const changed =
    !previous ||
    deps === undefined ||
    previous.deps === undefined ||
    deps.length !== previous.deps.length ||
    deps.some((value, i) => !Object.is(value, previous.deps[i]));

  if (!changed) return;

  if (previous?.cleanup) previous.cleanup();

  const cleanup = effect();
  currentSlots[index] = {
    kind: 'effect',
    deps: deps === undefined ? undefined : [...deps],
    cleanup: typeof cleanup === 'function' ? cleanup : undefined,
  };
}
