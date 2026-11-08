/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 10 · УПРАЖНЕНИЕ 10.5 (БОНУС) — Observable через Proxy
 * ═══════════════════════════════════════════════════════════
 *  Тема:           Proxy, Reflect, глубокое отслеживание изменений
 *  Java-аналогия:  PropertyChangeListener на всём графе объектов
 *  Тесты:          npx vitest run tests/m10/observable.test.js
 *  Уровень:        ★★★
 *
 *  ЗАДАНИЕ
 *  observable(obj, onChange) → глубокий Proxy.
 *  - чтение вложенного объекта возвращает тоже Proxy;
 *  - set уведомляет onChange({ type: 'set', path, value, oldValue });
 *  - deleteProperty → { type: 'delete', path, value: undefined, oldValue };
 *  - path — массив ключей от корня: ['nested', 'x'];
 *  - массивы работают (push уведомляет об изменении индекса;
 *    length обычно обновляется движком без отдельного set);
 *  - если значение не изменилось (Object.is), уведомления нет;
 *  - один и тот же объект при повторном чтении даёт тот же Proxy (кэш).
 *
 *  ПОДСКАЗКА
 *  Кэш — WeakMap<object, Proxy>. В get оборачивайте результат
 *  рекурсивно, добавляя ключ в path. Reflect.set возвращает boolean.
 *
 *  ЛОВУШКА
 *  Proxy не делает объект иммутабельным: target всё равно меняется.
 *  Для истории состояний по-прежнему нужны новые объекты.
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @typedef {{ type: 'set'|'delete', path: string[], value: any, oldValue: any }} Change
 */

/**
 * @template {object} T
 * @param {T} target
 * @param {(change: Change) => void} [onChange]
 * @returns {T}
 */
export function observable(target, onChange = () => {}) {
  throw new Error('TODO 10.5: not implemented');
}
