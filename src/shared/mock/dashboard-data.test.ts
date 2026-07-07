import { dashboardMock } from './dashboard-data';

describe('dashboard mock data', () => {
  it('contains essential sections', () => {
    expect(dashboardMock.metrics).toHaveLength(4);
    expect(dashboardMock.trend.length).toBeGreaterThan(0);
    expect(dashboardMock.alerts.length).toBeGreaterThan(0);
  });
});
