import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const domainDir = path.resolve(import.meta.dirname, '../../src/domain');

/** @type {string[]} */
const files = readdirSync(domainDir).filter(
  (file) => file.endsWith('.js') && file !== 'index.js',
);

describe('JSDoc in src/domain', () => {
  it('has at least one domain file to inspect', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    it(`${file}: every exported function has JSDoc with @returns`, () => {
      const source = readFileSync(path.join(domainDir, file), 'utf8');

      const exported = [
        ...source.matchAll(/export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g),
      ].map((match) => match[1]);

      const documented = [
        ...source.matchAll(
          /\/\*\*([\s\S]*?)\*\/\s*export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g,
        ),
      ];

      const documentedNames = new Set(documented.map((match) => match[2]));
      const missing = exported.filter((name) => !documentedNames.has(name));
      expect(missing, `${file}: функции без JSDoc: ${missing.join(', ')}`).toEqual([]);

      for (const match of documented) {
        const block = match[1];
        expect(block, `${file}: JSDoc для ${match[2]} должен содержать @param или @returns`).toMatch(
          /@param|@returns/,
        );
        expect(block, `${file}: JSDoc для ${match[2]} должен содержать @returns`).toMatch(
          /@returns/,
        );
      }
    });
  }
});
