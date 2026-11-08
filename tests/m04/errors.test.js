import { describe, expect, it } from 'vitest';
import {
  AppError,
  NetworkError,
  NotFoundError,
  ValidationError,
} from '../../src/core/errors.js';

describe('AppError', () => {
  it('is an Error with code, name and stack', () => {
    const error = new AppError('Something failed', { code: 'BOOM' });
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AppError');
    expect(error.message).toBe('Something failed');
    expect(error.code).toBe('BOOM');
    expect(error.stack).toBeTypeOf('string');
    expect(error.stack.length).toBeGreaterThan(0);
  });

  it('keeps the cause', () => {
    const root = new Error('root');
    const error = new AppError('wrapped', { cause: root });
    expect(error.cause).toBe(root);
  });
});

describe('ValidationError', () => {
  it('belongs to the whole hierarchy and keeps the field', () => {
    const error = new ValidationError('Title is invalid', 'title');
    expect(error).toBeInstanceOf(ValidationError);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ValidationError');
    expect(error.field).toBe('title');
    expect(error.code).toBe('VALIDATION_ERROR');
  });

  it('supports a cause', () => {
    const cause = new Error('reason');
    expect(new ValidationError('bad', 'title', { cause }).cause).toBe(cause);
  });
});

describe('NotFoundError and NetworkError', () => {
  it('NotFoundError has the right type and name', () => {
    const error = new NotFoundError('Task not found');
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe('NotFoundError');
  });

  it('NetworkError stores the HTTP status', () => {
    const error = new NetworkError('Server error', 500);
    expect(error).toBeInstanceOf(NetworkError);
    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe('NetworkError');
    expect(error.status).toBe(500);
    expect(new NetworkError('offline').status).toBe(0);
  });
});
