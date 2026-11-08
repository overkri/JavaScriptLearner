import { describe, expect, it } from 'vitest';
import { predictions } from '../../src/playground/eventLoopQuiz.js';

/** @param {number} ms */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** @returns {Promise<string[]>} */
async function syncPromiseTimeout() {
  const log = [];
  log.push('sync');
  setTimeout(() => log.push('timeout'), 0);
  Promise.resolve().then(() => log.push('promise'));
  log.push('end');
  await wait(10);
  return log;
}

/** @returns {Promise<string[]>} */
async function asyncAwait() {
  const log = [];
  async function foo() {
    log.push('foo-start');
    await null;
    log.push('foo-end');
  }
  foo();
  log.push('after-call');
  await wait(10);
  return log;
}

/** @returns {Promise<string[]>} */
async function microtasksBeforeTimers() {
  const log = [];
  setTimeout(() => log.push('timeout1'), 0);
  setTimeout(() => log.push('timeout2'), 0);
  Promise.resolve()
    .then(() => log.push('then1'))
    .then(() => log.push('then2'));
  queueMicrotask(() => log.push('microtask'));
  await wait(10);
  return log;
}

/** @returns {Promise<string[]>} */
async function microtaskOrder() {
  const log = [];
  Promise.resolve().then(() => log.push('promise'));
  queueMicrotask(() => log.push('queueMicrotask'));
  await wait(10);
  return log;
}

/** @returns {Promise<string[]>} */
async function asyncIife() {
  const log = [];
  // eslint-disable-next-line require-await -- async нужен, чтобы получить промис в квизе
  async function inner() {
    log.push('inner');
    return 1;
  }
  Promise.resolve().then(() => log.push('then'));
  (async () => {
    log.push('iife-start');
    await inner();
    log.push('iife-end');
  })();
  log.push('sync');
  await wait(10);
  return log;
}

/** @returns {Promise<string[]>} */
async function nestedMicrotask() {
  const log = [];
  setTimeout(() => log.push('timeout'), 0);
  Promise.resolve()
    .then(() => {
      log.push('then-start');
      queueMicrotask(() => log.push('nested'));
    })
    .then(() => log.push('then-end'));
  await wait(10);
  return log;
}

const runners = {
  syncPromiseTimeout,
  asyncAwait,
  microtasksBeforeTimers,
  microtaskOrder,
  asyncIife,
  nestedMicrotask,
};

describe('event loop quiz', () => {
  for (const [key, runner] of Object.entries(runners)) {
    it(`predicts ${key}`, async () => {
      const actual = await runner();
      expect(predictions[key], `predictions.${key} не совпал с реальным порядком`).toEqual(
        actual,
      );
    });
  }
});
