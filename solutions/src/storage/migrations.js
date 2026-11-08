/**
 * Эталон модуля 8.2 — миграции схемы.
 */

const CURRENT_VERSION = 3;

/**
 * @param {any} task
 * @returns {any}
 */
function migrateTaskV1ToV2(task) {
  let dueDate = task.dueDate ?? null;
  if (typeof dueDate === 'string' && dueDate) {
    const timestamp = Date.parse(`${dueDate.slice(0, 10)}T00:00:00.000Z`);
    dueDate = Number.isNaN(timestamp) ? null : timestamp;
  }
  return {
    ...task,
    tags: Array.isArray(task.tags) ? task.tags : [],
    dueDate,
  };
}

/**
 * @param {any} task
 * @returns {any}
 */
function migrateTaskV2ToV3(task) {
  let dueDate = null;
  if (typeof task.dueDate === 'number' && Number.isFinite(task.dueDate)) {
    dueDate = new Date(task.dueDate).toISOString().slice(0, 10);
  } else if (typeof task.dueDate === 'string' && task.dueDate) {
    const timestamp = Date.parse(`${task.dueDate.slice(0, 10)}T00:00:00.000Z`);
    dueDate = Number.isNaN(timestamp)
      ? null
      : new Date(timestamp).toISOString().slice(0, 10);
  }

  const tags = Array.isArray(task.tags)
    ? [
        ...new Set(
          task.tags
            .filter((tag) => typeof tag === 'string')
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean),
        ),
      ]
    : [];

  return {
    ...task,
    tags,
    dueDate,
    updatedAt:
      typeof task.updatedAt === 'string'
        ? task.updatedAt
        : typeof task.createdAt === 'string'
          ? task.createdAt
          : new Date().toISOString(),
  };
}

/**
 * @param {{ version?: number, tasks?: any[] }} data
 * @returns {{ version: 3, tasks: any[] }}
 */
export function migrate(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new TypeError('migrate expects a data object');
  }

  const version = data.version ?? 1;
  if (!Number.isInteger(version) || version < 1 || version > CURRENT_VERSION) {
    throw new RangeError(`Unsupported schema version: ${String(version)}`);
  }

  /** @type {{ version?: number, tasks?: any[] }} */
  let result = structuredClone(data);

  if (version < 2) {
    result = {
      ...result,
      version: 2,
      tasks: (result.tasks ?? []).map(migrateTaskV1ToV2),
    };
  }
  if (version < 3) {
    result = {
      ...result,
      version: 3,
      tasks: (result.tasks ?? []).map(migrateTaskV2ToV3),
    };
  }

  return /** @type {{ version: 3, tasks: any[] }} */ (result);
}
