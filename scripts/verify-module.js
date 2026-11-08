#!/usr/bin/env node
/**
 * Проверка решений одного или нескольких модулей.
 * Используется во время разработки курса:
 *
 *   node scripts/verify-module.js m01 m02
 *   node scripts/verify-module.js tests/m03/taskOps.test.js
 *
 * Полная проверка всех эталонов: node scripts/verify-solutions.js
 */

import { cpSync, existsSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const targets = args.length > 0 ? args.map((arg) => (arg.includes('/') || arg.includes('\\') ? arg : `tests/${arg}`)) : ['tests'];

// Временная папка внутри проекта: короткие 8.3-пути Windows (OVERKR~1)
// ломают загрузку модулей в jsdom-окружении Vitest.
const temp = mkdtempSync(path.join(root, '.verify-'));

try {
  for (const entry of ['src', 'tests', 'package.json', 'vite.config.js', 'jsconfig.json']) {
    cpSync(path.join(root, entry), path.join(temp, entry), { recursive: true });
  }
  if (existsSync(path.join(root, 'solutions', 'src'))) {
    cpSync(path.join(root, 'solutions', 'src'), path.join(temp, 'src'), {
      recursive: true,
      force: true,
    });
  }
  symlinkSync(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'junction');

  const result = spawnSync(
    process.execPath,
    [path.join(root, 'node_modules', 'vitest', 'vitest.mjs'), 'run', ...targets],
    { cwd: temp, stdio: 'inherit' },
  );
  process.exitCode = result.status ?? 1;
} finally {
  rmSync(temp, { recursive: true, force: true });
}
