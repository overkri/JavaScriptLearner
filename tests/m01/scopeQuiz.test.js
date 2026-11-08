import { describe, expect, it } from 'vitest';
import { predictions } from '../../src/playground/scopeQuiz.js';

/** @param {string} code */
function run(code) {
  return new Function(code)();
}

/** @param {string} code */
function runCatchingName(code) {
  try {
    run(code);
    return 'no error';
  } catch (error) {
    return error.name;
  }
}

const actual = {
  varBeforeDeclaration: run('var out; out = String(x); var x = 5; return out;'),
  letBlockShadowing: run('let y = 1; { let y = 2; } return y;'),
  constObjectMutation: run('const o = { a: 1 }; o.a = 2; return o.a;'),
  letBeforeDeclaration: runCatchingName('console.log(z); let z = 1;'),
  functionBeforeDeclaration: run("return foo(); function foo() { return 'works'; }"),
  constArrayMutation: run("const a = []; a.push(1); return 'allowed';"),
};

describe('Module 1 quiz — scope and hoisting', () => {
  for (const [key, value] of Object.entries(actual)) {
    it(`predicts ${key}`, () => {
      expect(predictions[key], `predictions.${key} не совпал с реальным поведением`).toEqual(value);
    });
  }
});
