import { describe, expect, it } from 'vitest';
import {
  Animal,
  Dog,
  hasOwnProp,
  hasProp,
  inherit,
} from '../../src/playground/prototypeQuiz.js';

describe('prototype chain', () => {
  it('Dog instances are instances of Dog and Animal', () => {
    const dog = new Dog('Rex');
    expect(dog).toBeInstanceOf(Dog);
    expect(dog).toBeInstanceOf(Animal);
    expect(dog).toBeInstanceOf(Object);
  });

  it('inherits speak from Animal.prototype', () => {
    const dog = new Dog('Rex');
    expect(dog.speak()).toBe('Rex makes a sound');
    expect(Object.hasOwn(dog, 'speak')).toBe(false);
  });

  it('adds fetch on Dog.prototype', () => {
    expect(new Dog('Rex').fetch()).toBe('Rex fetches the ball');
  });

  it('keeps constructor pointing to Dog', () => {
    expect(Dog.prototype.constructor).toBe(Dog);
  });

  it('inherit connects prototypes without touching the parent', () => {
    function Cat(name) {
      Animal.call(this, name);
    }
    inherit(Cat, Animal);
    const cat = new Cat('Tom');
    expect(cat.speak()).toBe('Tom makes a sound');
    expect(cat).toBeInstanceOf(Cat);
    expect(cat).toBeInstanceOf(Animal);
    expect(Animal.prototype.constructor).toBe(Animal);
  });
});

describe('hasOwnProp and hasProp', () => {
  it('distinguishes own properties from inherited ones', () => {
    const dog = new Dog('Rex');
    expect(hasOwnProp(dog, 'name')).toBe(true);
    expect(hasOwnProp(dog, 'speak')).toBe(false);
    expect(hasProp(dog, 'speak')).toBe(true);
    expect(hasProp(dog, 'missing')).toBe(false);
  });
});
