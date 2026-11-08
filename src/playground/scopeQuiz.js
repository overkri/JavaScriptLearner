/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 1 · УПРАЖНЕНИЕ 1.5 — Quiz: область видимости
 * ═══════════════════════════════════════════════════════════
 *  Тема:           hoisting, TDZ, var/let/const, блочная область
 *  Java-аналогия:  в Java переменная не существует до объявления,
 *                  а JS поднимает объявления (но не инициализацию)
 *  Тесты:          npx vitest run tests/m01/scopeQuiz.test.js
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  Запишите прогнозы для фрагментов. Тест выполнит аналогичный код
 *  и сравнит результат. Допустимые строки-ответы:
 *    'undefined' | 'ReferenceError' | 'works' | 'allowed'
 *  или конкретное число.
 *
 *  Ключи:
 *    varBeforeDeclaration, letBlockShadowing, constObjectMutation,
 *    letBeforeDeclaration, functionBeforeDeclaration, constArrayMutation
 *
 *  ЛОВУШКА
 *  const запрещает переприсваивание переменной, но не мутацию объекта.
 * ═══════════════════════════════════════════════════════════
 */

/** @type {Record<string, unknown>} */
export const predictions = {
  // TODO 1.5: запишите 6 прогнозов
};
