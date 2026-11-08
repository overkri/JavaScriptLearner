/**
 * Эталон модуля 8.4 — прогнозы JSON.
 */

/** @type {Record<string, unknown>} */
export const predictions = {
  undefinedProperty: '{}',
  undefinedInArray: '[null,null]',
  dateString: '"1970-01-01T00:00:00.000Z"',
  parsedDateIsString: true,
  customToJSON: '{"x":1}',
  mapBecomesEmpty: '{}',
  nanBecomesNull: 'null',
};
