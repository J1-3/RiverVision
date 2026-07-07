import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { DashboardPage } from './dashboard-page';

vi.mock('@/widgets/hero-banner/ui/hero-banner', () => ({
  HeroBanner: () => <div data-testid="hero-banner" />,
}));

vi.mock('@/widgets/trend-chart/ui/trend-chart', () => ({
  TrendChart: () => <div data-testid="trend-chart" />,
}));

vi.mock('@/widgets/distribution-chart/ui/distribution-chart', () => ({
  DistributionChart: () => <div data-testid="distribution-chart" />,
}));

describe('DashboardPage', () => {
  it('renders major dashboard content', async () => {
    render(<DashboardPage />);

    expect(await screen.findByText('核心指标')).toBeInTheDocument();
    expect(await screen.findByText('告警中心')).toBeInTheDocument();
    expect(await screen.findByText('实时态势')).toBeInTheDocument();
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('trend-chart')).toBeInTheDocument();
    expect(screen.getByTestId('distribution-chart')).toBeInTheDocument();
  });
});
