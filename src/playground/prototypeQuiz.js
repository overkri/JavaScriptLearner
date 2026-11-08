/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 4 · УПРАЖНЕНИЕ 4.6 — Quiz: прототипы без class
 * ═══════════════════════════════════════════════════════════
 *  Тема:           функция-конструктор, Object.create, instanceof, in
 *  Java-аналогия:  extends, но цепочка прототипов — это объекты,
 *                  а не классы; методы живут в prototype
 *  Тесты:          npx vitest run tests/m04/prototypeQuiz.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  1. Animal(name) — конструктор: this.name = name.
 *     Animal.prototype.speak() → `${name} makes a sound`.
 *  2. inherit(Child, Parent) — Child.prototype = Object.create(
 *     Parent.prototype), верните constructor обратно через
 *     Object.defineProperty.
 *  3. Dog(name) — вызывает Animal через Animal.call(this, name).
 *     ПОСЛЕ реализации inherit вызовите inherit(Dog, Animal) на уровне
 *     модуля и добавьте Dog.prototype.fetch() →
 *     `${name} fetches the ball`.
 *  4. hasOwnProp(obj, key) — Object.hasOwn; hasProp(obj, key) — key in obj.
 *
 *  ПОДСКАЗКА
 *  instanceof идёт по цепочке [[Prototype]], поэтому Dog должен быть
 *  связан с Animal.prototype до создания экземпляров.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @param {string} name
 * @this {{ name: string }}
 */
export function Animal(name) {
  throw new Error('TODO 4.6.1: not implemented');
}

/**
 * @param {Function} Child
 * @param {Function} Parent
 * @returns {void}
 */
export function inherit(Child, Parent) {
  throw new Error('TODO 4.6.2: not implemented');
}

/**
 * @param {string} name
 */
export function Dog(name) {
  throw new Error('TODO 4.6.3: not implemented');
}

/**
 * @param {object} obj
 * @param {PropertyKey} key
 * @returns {boolean}
 */
export function hasOwnProp(obj, key) {
  throw new Error('TODO 4.6.4: not implemented');
}

/**
 * @param {object} obj
 * @param {PropertyKey} key
 * @returns {boolean}
 */
export function hasProp(obj, key) {
  throw new Error('TODO 4.6.5: not implemented');
}
