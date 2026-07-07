import { useEffect, useState } from 'react';
import type { DashboardSnapshot } from '@/entities/dashboard/model/types';
import { dashboardRepository } from '@/shared/api/dashboard-service';
import { logger } from '@/shared/lib/logger';
import { MetricCard } from '@/shared/ui/metric-card/metric-card';
import { HeroBanner } from '@/widgets/hero-banner/ui/hero-banner';
import { TrendChart } from '@/widgets/trend-chart/ui/trend-chart';
import { DistributionChart } from '@/widgets/distribution-chart/ui/distribution-chart';
import { AlertsPanel } from '@/widgets/alerts-panel/ui/alerts-panel';
import { RealtimePanel } from '@/widgets/realtime-panel/ui/realtime-panel';

export function DashboardPage() {
  const [data, setData] = useState<DashboardSnapshot | null>(null);

  useEffect(() => {
    dashboardRepository
      .getSnapshot()
      .then((snapshot) => setData(snapshot))
      .catch((error) => logger.error('Dashboard page failed to load data', error));
  }, []);

  if (!data) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-grid">
          <HeroBanner />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-grid">
        <HeroBanner />
        <main className="dashboard-content">
          <section className="stack">
            <div className="panel">
              <h2 className="panel__title">核心指标</h2>
              <div className="metric-grid">
                {data.metrics.map((metric) => (
                  <MetricCard key={metric.label} {...metric} />
                ))}
              </div>
            </div>
            <TrendChart data={data.trend} />
          </section>

          <section className="center-stage">
            <div className="panel panel--center hero-map">
              <div className="hero-banner" style={{ minHeight: 390 }}>
                <div>
                  <div className="badge">RiverVision Live Map</div>
                  <h2 className="hero-banner__title" style={{ marginTop: 12 }}>
                    江河数据可视化中枢
                  </h2>
                  <p className="panel__subtitle">
                    以流域监测、设备运行、环境指标与告警联动为中心，构建统一态势图。
                  </p>
                  <div className="hero-banner__meta">
                    <div className="hero-banner__stat">
                      <div className="hero-banner__stat-value">47</div>
                      <div className="hero-banner__stat-label">高频采样点</div>
                    </div>
                    <div className="hero-banner__stat">
                      <div className="hero-banner__stat-value">12</div>
                      <div className="hero-banner__stat-label">关键泵站</div>
                    </div>
                    <div className="hero-banner__stat">
                      <div className="hero-banner__stat-value">8</div>
                      <div className="hero-banner__stat-label">重点风险区</div>
                    </div>
                  </div>
                </div>
                <div className="hero-banner__orbit">
                  <div className="hero-banner__ring" />
                  <div className="hero-banner__glow" />
                </div>
              </div>
            </div>
            <DistributionChart data={data.distribution} />
          </section>

          <section className="stack">
            <AlertsPanel alerts={data.alerts} />
            <RealtimePanel data={data} />
          </section>
        </main>
      </div>
    </div>
  );
}
