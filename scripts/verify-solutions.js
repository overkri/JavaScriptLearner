#!/usr/bin/env node
/**
 * Проверка эталонных решений.
 *
 * Копирует проект во временную папку, накладывает solutions/src поверх src
 * и прогоняет ВСЕ тесты. Позволяет убедиться, что эталоны действительно
 * проходят тесты, не трогая рабочие файлы студента.
 *
 * Запуск: node scripts/verify-solutions.js
 */

import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, symlinkSync, statSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const solutionsSrc = path.join(root, 'solutions', 'src');

if (!existsSync(solutionsSrc)) {
  console.error('✖ Не найдена папка solutions/src. Сначала создайте эталонные решения.');
  process.exit(1);
}

const missing = findMissingSolutions(path.join(root, 'src'), solutionsSrc);
if (missing.length > 0) {
  console.error('✖ В solutions/src не хватает файлов:');
  for (const file of missing) console.error(`  - ${file}`);
  process.exit(1);
}

// Временная папка внутри проекта: короткие 8.3-пути Windows (OVERKR~1)
// ломают загрузку модулей в jsdom-окружении Vitest.
const temp = mkdtempSync(path.join(root, '.verify-'));

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: temp,
    stdio: 'inherit',
    ...options,
  });
}

try {
  for (const entry of [
    'src',
    'tests',
    'scripts',
    'package.json',
    'vite.config.js',
    'jsconfig.json',
  ]) {
    const from = path.join(root, entry);
    if (existsSync(from)) {
      cpSync(from, path.join(temp, entry), { recursive: true });
    }
  }

  // Эталонные решения перекрывают заглушки.
  cpSync(solutionsSrc, path.join(temp, 'src'), { recursive: true, force: true });

  // node_modules не копируем — делаем ссылку на уже установленные зависимости.
  const nodeModules = path.join(root, 'node_modules');
  if (!existsSync(nodeModules)) {
    console.error('✖ Нет node_modules. Запустите npm install.');
    process.exit(1);
  }
  symlinkSync(nodeModules, path.join(temp, 'node_modules'), 'junction');

  console.log('\n▶ Проверка эталонов: запускаю все тесты на solutions/src\n');
  const result = run(process.execPath, [path.join(nodeModules, 'vitest', 'vitest.mjs'), 'run']);

  if (result.status === 0) {
    console.log('\n✔ Все тесты на эталонных решениях зелёные.\n');
  } else {
    console.error(`\n✖ Тесты на эталонах упали (код ${result.status ?? 'unknown'}).\n`);
    process.exitCode = result.status ?? 1;
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}

/**
 * Возвращает список файлов src, для которых нет зеркала в solutions/src.
 * @param {string} sourceDir
 * @param {string} solutionDir
 * @param {string} [prefix]
 * @returns {string[]}
 */
function findMissingSolutions(sourceDir, solutionDir, prefix = '') {
  /** @type {string[]} */
  const missing = [];
  for (const entry of readdirSync(sourceDir)) {
    const sourcePath = path.join(sourceDir, entry);
    const solutionPath = path.join(solutionDir, entry);
    const relative = prefix ? `${prefix}/${entry}` : entry;
    if (statSync(sourcePath).isDirectory()) {
      if (!existsSync(solutionPath)) {
        missing.push(`${relative}/ (нет папки)`);
      } else {
        missing.push(...findMissingSolutions(sourcePath, solutionPath, relative));
      }
    } else if (!existsSync(solutionPath)) {
      missing.push(relative);
    }
  }
  return missing;
}
