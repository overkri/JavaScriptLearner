/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 4 · УПРАЖНЕНИЕ 4.1 — Иерархия ошибок
 * ═══════════════════════════════════════════════════════════
 *  Тема:           class extends Error, cause, instanceof, stack
 *  Java-аналогия:  RuntimeException → ValidationException,
 *                  NotFoundException, NetworkException
 *  Тесты:          npx vitest run tests/m04/errors.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  Создайте иерархию:
 *    AppError extends Error          — базовый, поддерживает { cause }, code
 *    ValidationError extends AppError — поле field
 *    NotFoundError extends AppError
 *    NetworkError extends AppError    — поле status
 *  Требования:
 *  - корректный name (ValidationError и т.д.);
 *  - instanceof работает на всех уровнях;
 *  - stack — непустая строка;
 *  - конструкторы принимают message; AppError — вторым аргументом
 *    options вида { cause, code }.
 *
 *  ПОДСКАЗКА
 *  super(message, options) поддерживает cause в Node 16.9+ и браузерах.
 *  В подклассах можно сделать this.name = 'ValidationError'.
 * ═══════════════════════════════════════════════════════════
 */

/** @typedef {{ cause?: unknown, code?: string }} AppErrorOptions */

export class AppError extends Error {
  /**
   * @param {string} message
   * @param {AppErrorOptions} [options]
   */
  constructor(message, options = {}) {
    super(message);
    throw new Error('TODO 4.1.1: not implemented');
  }
}

export class ValidationError extends AppError {
  /**
   * @param {string} message
   * @param {string} field
   * @param {AppErrorOptions} [options]
   */
  constructor(message, field, options = {}) {
    super(message);
    throw new Error('TODO 4.1.2: not implemented');
  }
}

export class NotFoundError extends AppError {
  /**
   * @param {string} message
   * @param {AppErrorOptions} [options]
   */
  constructor(message, options = {}) {
    super(message);
    throw new Error('TODO 4.1.3: not implemented');
  }
}

export class NetworkError extends AppError {
  /**
   * @param {string} message
   * @param {number} [status]
   * @param {AppErrorOptions} [options]
   */
  constructor(message, status = 0, options = {}) {
    super(message);
    throw new Error('TODO 4.1.4: not implemented');
  }
}
