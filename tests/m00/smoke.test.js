import { describe, expect, it } from 'vitest';
import { greet } from '../../src/playground/hello.js';

describe('Модуль 0 — окружение', () => {
  it('greet returns a string containing the name', () => {
    const result = greet('Ада');
    expect(typeof result, 'greet() должна вернуть строку').toBe('string');
    expect(result, 'в приветствии должно быть имя').toContain('Ада');
  });

  it('runs on Node.js 20 or newer', () => {
    const major = Number(process.versions.node.split('.')[0]);
    expect(major, `Node ${process.versions.node} слишком старый`).toBeGreaterThanOrEqual(20);
  });
});
