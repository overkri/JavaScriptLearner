import { beforeEach, describe, expect, it } from 'vitest';
import { loadStatsPanel, resetStatsPanel } from '../../src/features/stats/index.js';

beforeEach(() => {
  resetStatsPanel();
});

describe('loadStatsPanel', () => {
  it('loads the panel module lazily and returns renderStatsPanel', async () => {
    const panel = await loadStatsPanel();
    expect(panel.renderStatsPanel).toBeTypeOf('function');
    expect(panel.panelName).toBe('stats-panel');
  });

  it('returns the same promise for repeated calls (one import)', async () => {
    const first = loadStatsPanel();
    const second = loadStatsPanel();
    expect(first).toBe(second);
    await first;
  });

  it('loads again after reset', async () => {
    const first = loadStatsPanel();
    await first;
    resetStatsPanel();
    const second = loadStatsPanel();
    expect(second).not.toBe(first);
    await second;
  });
});
