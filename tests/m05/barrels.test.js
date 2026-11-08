import { describe, expect, it } from 'vitest';

describe('core barrel', () => {
  it('exposes EventEmitter, Store, errors and TaskList', async () => {
    const core = await import('../../src/core/index.js');
    expect(core.EventEmitter).toBeTypeOf('function');
    expect(core.Store).toBeTypeOf('function');
    expect(core.AppError).toBeTypeOf('function');
    expect(core.ValidationError).toBeTypeOf('function');
    expect(core.NotFoundError).toBeTypeOf('function');
    expect(core.NetworkError).toBeTypeOf('function');
    expect(core.TaskList).toBeTypeOf('function');
  });
});

describe('domain barrel', () => {
  it('has createTask as default and as a named export', async () => {
    const domain = await import('../../src/domain/index.js');
    expect(domain.default).toBeTypeOf('function');
    expect(domain.createTask).toBe(domain.default);
  });

  it('re-exports domain functions and classes', async () => {
    const domain = await import('../../src/domain/index.js');
    const names = [
      'updateTask',
      'isOverdue',
      'addTask',
      'removeTask',
      'filterTasks',
      'sortTasks',
      'groupByStatus',
      'computeStats',
      'collectTags',
      'tagFrequency',
      'renameTag',
      'TaskList',
      'PRIORITY',
      'priorityWeight',
      'isPriority',
    ];
    for (const name of names) {
      expect(domain[name], `domain/index.js должен экспортировать ${name}`).toBeDefined();
    }
  });
});
