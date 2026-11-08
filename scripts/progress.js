#!/usr/bin/env node
/**
 * Печатает прогресс по модулям на основе результатов vitest.
 * Запуск: node scripts/progress.js
 */

import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const outFile = path.join(mkdtempSync(path.join(tmpdir(), 'taskflow-progress-')), 'results.json');

const vitest = path.join(root, 'node_modules', 'vitest', 'vitest.mjs');
if (!existsSync(vitest)) {
  console.error('✖ Нет node_modules. Запустите npm install.');
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  [vitest, 'run', '--reporter=json', '--outputFile', outFile],
  { cwd: root, encoding: 'utf8', env: { ...process.env, CI: 'true' } },
);

let report;
try {
  report = JSON.parse(readFileSync(outFile, 'utf8'));
} catch {
  console.error('✖ Не удалось прочитать отчёт vitest.');
  if (result.stderr) console.error(result.stderr.trim().split('\n').slice(-10).join('\n'));
  rmSync(path.dirname(outFile), { recursive: true, force: true });
  process.exit(1);
}

const modules = new Map();
for (const fileResult of report.testResults ?? []) {
  const match = fileResult.name.replaceAll('\\', '/').match(/tests\/(m\d{2})\//);
  if (!match) continue;
  const id = match[1];
  if (!modules.has(id)) modules.set(id, { passed: 0, total: 0 });
  const bucket = modules.get(id);
  for (const test of fileResult.assertionResults ?? []) {
    bucket.total += 1;
    if (test.status === 'passed') bucket.passed += 1;
  }
}

const names = {
  m00: 'Старт и инструменты',
  m01: 'Основы языка',
  m02: 'Функции и замыкания',
  m03: 'Объекты и массивы',
  m04: 'this, прототипы, классы',
  m05: 'ES-модули',
  m06: 'DOM и события',
  m07: 'Асинхронность',
  m08: 'Хранилище и сериализация',
  m09: 'Состояние и архитектура',
  m10: 'Продвинутые возможности',
  m11: 'Качество и типизация',
  m12: 'Мини-React',
};

let passed = 0;
let total = 0;
console.log('\nПрогресс TaskFlow\n');
for (const id of [...modules.keys()].sort()) {
  const { passed: p, total: t } = modules.get(id);
  passed += p;
  total += t;
  const mark = p === t && t > 0 ? '✓' : ' ';
  console.log(`  ${mark} Модуль ${Number(id.slice(1))}: ${p}/${t} тестов — ${names[id] ?? ''}`);
}

const percent = total === 0 ? 0 : Math.round((passed / total) * 100);
console.log(`\nВсего: ${passed}/${total} (${percent}%)\n`);

rmSync(path.dirname(outFile), { recursive: true, force: true });
