import { describe, expect, it } from 'vitest';
import { predictions } from '../../src/playground/jsonPitfalls.js';

const actual = {
  undefinedProperty: JSON.stringify({ a: undefined }),
  undefinedInArray: JSON.stringify([undefined, () => {}]),
  dateString: JSON.stringify(new Date(0)),
  parsedDateIsString: typeof JSON.parse(JSON.stringify(new Date(0))) === 'string',
  customToJSON: JSON.stringify({ toJSON: () => ({ x: 1 }) }),
  mapBecomesEmpty: JSON.stringify(new Map([['a', 1]])),
  nanBecomesNull: JSON.stringify(NaN),
};

describe('JSON pitfalls quiz', () => {
  for (const [key, value] of Object.entries(actual)) {
    it(`predicts ${key}`, () => {
      expect(predictions[key], `predictions.${key} не совпал`).toEqual(value);
    });
  }
});
