/**
 * Эталон модуля 4.6 — прототипное наследование вручную.
 */

/**
 * @param {string} name
 * @this {{ name: string }}
 */
export function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function speak() {
  return `${this.name} makes a sound`;
};

/**
 * @param {Function} Child
 * @param {Function} Parent
 * @returns {void}
 */
export function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Object.defineProperty(Child.prototype, 'constructor', {
    value: Child,
    writable: true,
    configurable: true,
  });
}

/**
 * @param {string} name
 */
export function Dog(name) {
  Animal.call(this, name);
}

inherit(Dog, Animal);

Dog.prototype.fetch = function fetch() {
  return `${this.name} fetches the ball`;
};

/**
 * @param {object} obj
 * @param {PropertyKey} key
 * @returns {boolean}
 */
export function hasOwnProp(obj, key) {
  return Object.hasOwn(obj, key);
}

/**
 * @param {object} obj
 * @param {PropertyKey} key
 * @returns {boolean}
 */
export function hasProp(obj, key) {
  return key in obj;
}
