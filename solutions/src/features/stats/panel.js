/**
 * ГОТОВЫЙ МОДУЛЬ · Панель статистики (загружается лениво).
 * Не упражнение. Импортируется динамически из features/stats/index.js.
 */

export const panelName = 'stats-panel';

/**
 * Рисует панель статистики в контейнере.
 * @param {HTMLElement} container
 * @param {import('../../domain/stats.js').TaskStats} stats
 * @returns {HTMLElement}
 */
export function renderStatsPanel(container, stats) {
  container.replaceChildren();

  const grid = document.createElement('div');
  grid.className = 'stats-grid';

  const cards = [
    ['Всего задач', String(stats.total)],
    ['Выполнено', String(stats.byStatus.done)],
    ['Просрочено', String(stats.overdue)],
    ['Прогресс', `${Math.round(stats.completionRate * 100)}%`],
  ];

  for (const [label, value] of cards) {
    const card = document.createElement('div');
    card.className = 'stats-card';

    const caption = document.createElement('div');
    caption.className = 'stats-card__label';
    caption.textContent = label;

    const number = document.createElement('div');
    number.className = 'stats-card__value';
    number.textContent = value;

    card.append(caption, number);
    grid.append(card);
  }

  container.append(grid);

  if (stats.topTags.length > 0) {
    const tags = document.createElement('p');
    tags.className = 'task-card__tags';
    tags.textContent = `Частые теги: ${stats.topTags
      .map((item) => `#${item.tag} (${item.count})`)
      .join(', ')}`;
    container.append(tags);
  }

  return container;
}
