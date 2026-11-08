/**
 * ═══════════════════════════════════════════════════════════
 *  ГОТОВЫЙ МОДУЛЬ · In-memory «сервер» TaskFlow
 * ═══════════════════════════════════════════════════════════
 *  Этот файл — не упражнение. Он изображает REST-бэкенд:
 *  задержки, ошибки, AbortSignal и настоящий Response.
 *
 *  Эндпоинты:
 *    GET    /api/tasks        — список задач
 *    POST   /api/tasks        — создать задачу
 *    GET    /api/tasks/:id    — одна задача
 *    PUT    /api/tasks/:id    — заменить задачу
 *    PATCH  /api/tasks/:id    — частично обновить
 *    DELETE /api/tasks/:id    — удалить
 *    GET    /api/settings     — настройки (для Promise.allSettled)
 *
 *  В тестах используйте детерминированный сервер:
 *    const server = createFakeServer({ latency: [0, 0], errorRate: 0 });
 * ═══════════════════════════════════════════════════════════
 */

/** @typedef {'low'|'medium'|'high'} Priority */
/** @typedef {'todo'|'in-progress'|'done'} Status */
/** @typedef {{ id: string, title: string, description: string, status: Status, priority: Priority, tags: string[], createdAt: string, updatedAt: string, dueDate: string|null }} Task */

export const STATUSES = Object.freeze(['todo', 'in-progress', 'done']);
export const PRIORITIES = Object.freeze(['low', 'medium', 'high']);

const DEFAULT_LATENCY = [200, 800];
const DEFAULT_ERROR_RATE = 0.15;

/** @returns {Task[]} */
export function createSeedTasks() {
  /** @param {Partial<Task> & { id: string, title: string }} task */
  const make = (task) => ({
    id: task.id,
    title: task.title,
    description: task.description ?? '',
    status: task.status ?? 'todo',
    priority: task.priority ?? 'medium',
    tags: task.tags ?? [],
    createdAt: task.createdAt ?? '2026-10-20T09:00:00.000Z',
    updatedAt: task.updatedAt ?? '2026-10-20T09:00:00.000Z',
    dueDate: task.dueDate ?? null,
  });

  return [
    make({
      id: 'task-1',
      title: 'Настроить окружение',
      description: 'npm, Vite, Vitest, DevTools',
      priority: 'high',
      tags: ['setup', 'js'],
      dueDate: '2026-11-10',
      createdAt: '2026-10-20T09:00:00.000Z',
      updatedAt: '2026-10-21T10:00:00.000Z',
    }),
    make({
      id: 'task-2',
      title: 'Разобраться с типами',
      description: 'typeof, ==, NaN, truthy/falsy',
      priority: 'medium',
      tags: ['js', 'basics'],
      dueDate: '2026-11-12',
      createdAt: '2026-10-21T09:00:00.000Z',
      updatedAt: '2026-10-21T09:00:00.000Z',
    }),
    make({
      id: 'task-3',
      title: 'Написать debounce',
      description: 'Замыкания и таймеры',
      status: 'in-progress',
      priority: 'high',
      tags: ['functions', 'js'],
      dueDate: '2026-11-09',
      createdAt: '2026-10-22T09:00:00.000Z',
      updatedAt: '2026-11-02T12:30:00.000Z',
    }),
    make({
      id: 'task-4',
      title: 'Иммутабельные операции',
      description: 'spread, map/filter/reduce',
      status: 'in-progress',
      priority: 'medium',
      tags: ['arrays', 'react'],
      dueDate: '2026-11-05',
      createdAt: '2026-10-23T09:00:00.000Z',
      updatedAt: '2026-11-01T08:15:00.000Z',
    }),
    make({
      id: 'task-5',
      title: 'Классы и this',
      description: 'bind, call, apply, прототипы',
      priority: 'high',
      tags: ['oop'],
      createdAt: '2026-10-24T09:00:00.000Z',
      updatedAt: '2026-10-24T09:00:00.000Z',
    }),
    make({
      id: 'task-6',
      title: 'ES-модули',
      description: 'barrel, dynamic import',
      status: 'done',
      priority: 'low',
      tags: ['modules'],
      dueDate: '2026-11-01',
      createdAt: '2026-10-24T10:00:00.000Z',
      updatedAt: '2026-11-01T18:00:00.000Z',
    }),
    make({
      id: 'task-7',
      title: 'DOM: карточки задач',
      description: 'createElement, события, делегирование',
      priority: 'high',
      tags: ['dom'],
      dueDate: '2026-11-20',
      createdAt: '2026-10-25T09:00:00.000Z',
      updatedAt: '2026-10-25T09:00:00.000Z',
    }),
    make({
      id: 'task-8',
      title: 'Модальное окно',
      description: 'focus trap, Esc, aria',
      status: 'in-progress',
      priority: 'medium',
      tags: ['dom', 'ui'],
      dueDate: '2026-11-18',
      createdAt: '2026-10-26T09:00:00.000Z',
      updatedAt: '2026-11-03T14:40:00.000Z',
    }),
    make({
      id: 'task-9',
      title: 'Загрузка данных',
      description: 'fetch, async/await, AbortController',
      priority: 'medium',
      tags: ['async'],
      dueDate: '2026-11-25',
      createdAt: '2026-10-27T09:00:00.000Z',
      updatedAt: '2026-10-27T09:00:00.000Z',
    }),
    make({
      id: 'task-10',
      title: 'localStorage',
      description: 'JSON, версии схемы, миграции',
      status: 'done',
      priority: 'low',
      tags: ['storage'],
      dueDate: '2026-10-30',
      createdAt: '2026-10-27T10:00:00.000Z',
      updatedAt: '2026-10-30T20:10:00.000Z',
    }),
    make({
      id: 'task-11',
      title: 'Undo/Redo',
      description: 'history, reducer, горячие клавиши',
      priority: 'high',
      tags: ['state'],
      dueDate: '2026-12-01',
      createdAt: '2026-10-28T09:00:00.000Z',
      updatedAt: '2026-10-28T09:00:00.000Z',
    }),
    make({
      id: 'task-12',
      title: 'Поиск по тегам',
      description: 'regex, query parser, debounce',
      status: 'in-progress',
      priority: 'medium',
      tags: ['search', 'regex'],
      dueDate: '2026-11-22',
      createdAt: '2026-10-29T09:00:00.000Z',
      updatedAt: '2026-11-04T11:20:00.000Z',
    }),
  ];
}

/**
 * @param {number} ms
 * @param {AbortSignal|undefined} signal
 * @returns {Promise<void>}
 */
function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('The operation was aborted', 'AbortError'));
      return;
    }

    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, ms);

    const onAbort = () => {
      cleanup();
      reject(new DOMException('The operation was aborted', 'AbortError'));
    };

    function cleanup() {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
    }

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/**
 * @param {unknown} body
 * @param {number} [status]
 * @returns {Response}
 */
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function normalizeTitle(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * @param {unknown} tags
 * @returns {string[]}
 */
function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.filter((tag) => typeof tag === 'string').map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
}

/**
 * Создаёт независимый экземпляр fake-сервера.
 *
 * @param {{ latency?: [number, number], errorRate?: number, tasks?: Task[] }} [options]
 */
export function createFakeServer(options = {}) {
  const latency = options.latency ?? DEFAULT_LATENCY;
  const config = {
    /** @type {[number, number]} */
    latency: [latency[0], latency[1]],
    errorRate: options.errorRate ?? DEFAULT_ERROR_RATE,
  };

  /** @type {Task[]} */
  let tasks = structuredClone(options.tasks ?? createSeedTasks());
  let counter = 100;

  /** @type {Array<{ method: string, path: string, at: number }>} */
  const requestLog = [];

  /**
   * @param {string|URL|Request} input
   * @param {RequestInit} [init]
   * @returns {Promise<Response>}
   */
  async function fakeFetch(input, init = {}) {
    const url = new URL(
      typeof input === 'string' || input instanceof URL ? String(input) : input.url,
      'http://localhost',
    );
    const method = (init.method ?? (typeof input === 'object' && 'method' in input ? input.method : 'GET')).toUpperCase();
    const signal = init.signal ?? undefined;

    requestLog.push({ method, path: url.pathname, at: Date.now() });

    const [min, max] = config.latency;
    const delay = min + Math.random() * Math.max(0, max - min);
    await wait(delay, signal);

    if (Math.random() < config.errorRate) {
      return json({ error: 'Internal Server Error' }, 500);
    }

    /** @type {Record<string, any>} */
    let body = {};
    if (init.body != null) {
      try {
        body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
      } catch {
        return json({ error: 'Invalid JSON body' }, 400);
      }
    }

    const match = url.pathname.match(/^\/api\/tasks\/(?<id>[^/]+)$/);

    if (url.pathname === '/api/settings' && method === 'GET') {
      return json({ theme: 'system', locale: 'ru-RU' });
    }

    if (url.pathname === '/api/tasks' && method === 'GET') {
      return json(tasks);
    }

    if (url.pathname === '/api/tasks' && method === 'POST') {
      const title = normalizeTitle(body.title);
      if (!title) return json({ error: 'title is required' }, 400);
      if (title.length > 80) return json({ error: 'title is too long' }, 400);

      const now = new Date().toISOString();
      /** @type {Task} */
      const task = {
        id: `task-${++counter}`,
        title,
        description: typeof body.description === 'string' ? body.description : '',
        status: STATUSES.includes(body.status) ? body.status : 'todo',
        priority: PRIORITIES.includes(body.priority) ? body.priority : 'medium',
        tags: normalizeTags(body.tags),
        createdAt: now,
        updatedAt: now,
        dueDate: typeof body.dueDate === 'string' && body.dueDate ? body.dueDate : null,
      };
      tasks.push(task);
      return json(task, 201);
    }

    if (match && match.groups) {
      const id = match.groups.id;
      const index = tasks.findIndex((task) => task.id === id);

      if (index === -1) {
        return json({ error: `Task ${id} not found` }, 404);
      }

      if (method === 'GET') {
        return json(tasks[index]);
      }

      if (method === 'DELETE') {
        tasks.splice(index, 1);
        return new Response(null, { status: 204 });
      }

      if (method === 'PATCH' || method === 'PUT') {
        const current = tasks[index];
        const isReplace = method === 'PUT';
        const title = body.title === undefined && !isReplace ? current.title : normalizeTitle(body.title);

        if (!title) return json({ error: 'title is required' }, 400);
        if (title.length > 80) return json({ error: 'title is too long' }, 400);

        /** @type {Task} */
        const next = isReplace
          ? {
              id: current.id,
              title,
              description: typeof body.description === 'string' ? body.description : '',
              status: STATUSES.includes(body.status) ? body.status : 'todo',
              priority: PRIORITIES.includes(body.priority) ? body.priority : 'medium',
              tags: normalizeTags(body.tags),
              createdAt: current.createdAt,
              updatedAt: new Date().toISOString(),
              dueDate: typeof body.dueDate === 'string' && body.dueDate ? body.dueDate : null,
            }
          : {
              ...current,
              ...(body.title !== undefined ? { title } : {}),
              ...(body.description !== undefined ? { description: String(body.description) } : {}),
              ...(STATUSES.includes(body.status) ? { status: body.status } : {}),
              ...(PRIORITIES.includes(body.priority) ? { priority: body.priority } : {}),
              ...(body.tags !== undefined ? { tags: normalizeTags(body.tags) } : {}),
              ...(body.dueDate !== undefined
                ? { dueDate: typeof body.dueDate === 'string' && body.dueDate ? body.dueDate : null }
                : {}),
              updatedAt: new Date().toISOString(),
            };

        tasks[index] = next;
        return json(next);
      }

      return json({ error: `Method ${method} not allowed` }, 405);
    }

    return json({ error: 'Not found' }, 404);
  }

  /**
   * Меняет настройки на лету: fakeFetch.configure({ errorRate: 1 }).
   * @param {{ latency?: [number, number], errorRate?: number }} patch
   */
  fakeFetch.configure = (patch) => {
    if (patch.latency) config.latency = [patch.latency[0], patch.latency[1]];
    if (typeof patch.errorRate === 'number') config.errorRate = patch.errorRate;
    return config;
  };

  /**
   * Сбрасывает состояние сервера.
   * @param {Task[]} [nextTasks]
   */
  fakeFetch.reset = (nextTasks) => {
    tasks = structuredClone(nextTasks ?? createSeedTasks());
    counter = 100;
    requestLog.length = 0;
  };

  /** @returns {Task[]} */
  fakeFetch.getTasks = () => structuredClone(tasks);

  /** @returns {Array<{ method: string, path: string, at: number }>} */
  fakeFetch.getRequestLog = () => [...requestLog];

  fakeFetch.config = config;

  return fakeFetch;
}

/**
 * Общий сервер приложения. В тестах его можно перенастроить:
 * fakeFetch.configure({ latency: [0, 0], errorRate: 0 }).
 * @type {ReturnType<typeof createFakeServer>}
 */
export const fakeFetch = createFakeServer();
