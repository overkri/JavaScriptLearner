/**
 * ═══════════════════════════════════════════════════════════
 *  МОДУЛЬ 12 · УПРАЖНЕНИЕ 12.5d — Компонент SearchBar
 * ═══════════════════════════════════════════════════════════
 *  Тема:           контролируемый input, события
 *  Тесты:          npx vitest run tests/m12/components.test.js   (jsdom)
 *  Уровень:        ★★☆
 *
 *  ЗАДАНИЕ
 *  SearchBar({ value = '', onChange }) → label.search с input.search__input
 *  (type="search", value, placeholder «Поиск задач…»). На onInput
 *  вызывайте onChange(event.target.value).
 * ═══════════════════════════════════════════════════════════
 */

/**
 * @param {{ value?: string, onChange?: (value: string) => void }} props
 * @returns {import('../createElement.js').VNode}
 */
export function SearchBar({ value = '', onChange = () => {} }) {
  throw new Error('TODO 12.5d: not implemented');
}
