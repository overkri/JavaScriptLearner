/**
 * Модуль 12.5 — строка поиска.
 */

import { h } from '../createElement.js';

/**
 * @param {{ value?: string, onChange?: (value: string) => void }} props
 */
export function SearchBar({ value = '', onChange = () => {} }) {
  return h(
    'label',
    { className: 'search' },
    h('span', { className: 'search__icon' }, '⌕'),
    h('input', {
      className: 'search__input',
      type: 'search',
      value,
      placeholder: 'Поиск задач…',
      onInput: (event) => onChange(event.target.value),
    }),
  );
}
