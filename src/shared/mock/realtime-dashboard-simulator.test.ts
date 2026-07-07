import { describe, expect, it } from 'vitest';
import { getNextDashboardSnapshot, resetSimulator } from './realtime-dashboard-simulator';

describe('realtime dashboard simulator', () => {
  it('returns a dashboard snapshot with required sections', () => {
    resetSimulator();
    const snapshot = getNextDashboardSnapshot();

    expect(snapshot.title).toBe('RiverVision');
    expect(snapshot.metrics).toHaveLength(4);
    expect(snapshot.trend.length).toBeGreaterThan(0);
    expect(snapshot.trend.length).toBeLessThanOrEqual(10);
    expect(snapshot.alerts.length).toBeGreaterThan(0);
    expect(snapshot.distribution).toHaveLength(3);
    expect(snapshot.coverage).toHaveLength(3);
    expect(snapshot.radar).toHaveLength(6);
  });

  it('produces different snapshots across calls', () => {
    resetSimulator();
    const first = getNextDashboardSnapshot();
    const second = getNextDashboardSnapshot();

    expect(first.metrics).not.toEqual(second.metrics);
  });

  it('keeps trend array within bounds', () => {
    resetSimulator();
    for (let i = 0; i < 20; i++) {
      const snapshot = getNextDashboardSnapshot();
      expect(snapshot.trend.length).toBeGreaterThanOrEqual(8);
      expect(snapshot.trend.length).toBeLessThanOrEqual(10);
    }
  });

  it('keeps alerts array within bounds', () => {
    resetSimulator();
    for (let i = 0; i < 20; i++) {
      const snapshot = getNextDashboardSnapshot();
      expect(snapshot.alerts.length).toBeGreaterThanOrEqual(1);
      expect(snapshot.alerts.length).toBeLessThanOrEqual(5);
    }
  });

  it('keeps distribution sum at 100', () => {
    resetSimulator();
    for (let i = 0; i < 30; i++) {
      const snapshot = getNextDashboardSnapshot();
      const total = snapshot.distribution.reduce((sum, item) => sum + item.value, 0);
      expect(total).toBe(100);
    }
  });

  it('keeps coverage values within range', () => {
    resetSimulator();
    for (let i = 0; i < 30; i++) {
      const snapshot = getNextDashboardSnapshot();
      for (const item of snapshot.coverage) {
        expect(item.value).toBeGreaterThanOrEqual(80);
        expect(item.value).toBeLessThanOrEqual(100);
      }
    }
  });

  it('updates metrics delta across calls', () => {
    resetSimulator();
    const first = getNextDashboardSnapshot();
    getNextDashboardSnapshot();
    getNextDashboardSnapshot();
    const thirdDeltas = first.metrics.map((m) => m.delta).join('|');
    getNextDashboardSnapshot();
    const fourth = getNextDashboardSnapshot();
    const fourthDeltas = fourth.metrics.map((m) => m.delta).join('|');

    expect(thirdDeltas).not.toEqual(fourthDeltas);
  });

  it('keeps radar values within range', () => {
    resetSimulator();
    for (let i = 0; i < 10; i++) {
      getNextDashboardSnapshot();
      const snapshot = getNextDashboardSnapshot();
      for (const item of snapshot.radar) {
        expect(item.value).toBeGreaterThanOrEqual(60);
        expect(item.value).toBeLessThanOrEqual(100);
      }
    }
  });

  it('restores initial state on reset', () => {
    resetSimulator();
    const first = getNextDashboardSnapshot();
    resetSimulator();
    const second = getNextDashboardSnapshot();

    expect(first.metrics[0].value).not.toEqual(second.metrics[0].value);
  });
});
