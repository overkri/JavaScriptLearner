/**
 * Эталон модуля 4.1 — иерархия ошибок.
 */

/** @typedef {{ cause?: unknown, code?: string }} AppErrorOptions */

export class AppError extends Error {
  /**
   * @param {string} message
   * @param {AppErrorOptions} [options]
   */
  constructor(message, options = {}) {
    super(message, options);
    this.name = 'AppError';
    this.code = options.code ?? 'APP_ERROR';
  }
}

export class ValidationError extends AppError {
  /**
   * @param {string} message
   * @param {string} field
   * @param {AppErrorOptions} [options]
   */
  constructor(message, field, options = {}) {
    super(message, { code: 'VALIDATION_ERROR', ...options });
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class NotFoundError extends AppError {
  /**
   * @param {string} message
   * @param {AppErrorOptions} [options]
   */
  constructor(message, options = {}) {
    super(message, { code: 'NOT_FOUND', ...options });
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends AppError {
  /**
   * @param {string} message
   * @param {number} [status]
   * @param {AppErrorOptions} [options]
   */
  constructor(message, status = 0, options = {}) {
    super(message, { code: 'NETWORK_ERROR', ...options });
    this.name = 'NetworkError';
    this.status = status;
  }
}
