import { useEffect, useMemo, useState } from 'react';
import type { DashboardSnapshot } from '@/entities/dashboard/model/types';
import { dashboardRepository } from '@/shared/api/dashboard-service';
import { logger } from '@/shared/lib/logger';
import { DataFlowRibbon } from '@/shared/ui/data-flow-ribbon/data-flow-ribbon';
import { MetricCard } from '@/shared/ui/metric-card/metric-card';
import { HeroBanner } from '@/widgets/hero-banner/ui/hero-banner';
import { TrendChart } from '@/widgets/trend-chart/ui/trend-chart';
import { DistributionChart } from '@/widgets/distribution-chart/ui/distribution-chart';
import { AlertsPanel } from '@/widgets/alerts-panel/ui/alerts-panel';
import { RealtimePanel } from '@/widgets/realtime-panel/ui/realtime-panel';
import { RadarChart } from '@/widgets/radar-chart/ui/radar-chart';

export function DashboardPage() {
  const [data, setData] = useState<DashboardSnapshot | null>(null);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [clockLabel, setClockLabel] = useState(() => new Date().toLocaleTimeString('zh-CN', { hour12: false }));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const snapshot = await dashboardRepository.getSnapshot();
        if (isMounted) {
          setData(snapshot);
          setIsLoading(false);
        }
      } catch (error) {
        logger.error('Dashboard page failed to load data', error);
      }
    }

    load();

    const timer = window.setInterval(() => {
      setTickerIndex((currentIndex) => currentIndex + 1);
      setClockLabel(new Date().toLocaleTimeString('zh-CN', { hour12: false }));
    }, 3500);

    return () => {
      isMounted = false;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    const timer = window.setInterval(async () => {
      try {
        const snapshot = await dashboardRepository.getSnapshot();
        setData(snapshot);
      } catch (error) {
        logger.error('Dashboard page failed to refresh data', error);
      }
    }, 2000);

    return () => window.clearInterval(timer);
  }, [data]);

  const activeFlow = useMemo(() => {
    if (!data) {
      return null;
    }

    const flowItems = [...data.liveStreams, ...data.coverage.map((item) => ({
      label: item.label,
      value: `${item.value}%`,
      state: '系统联动',
    }))];

    return flowItems[tickerIndex % flowItems.length] ?? null;
  }, [data, tickerIndex]);

  if (isLoading || !data) {
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
        <HeroBanner data={data} />
        {activeFlow ? (
          <div className="dashboard-flow-strip">
            <DataFlowRibbon
              label={`数据流 · ${clockLabel}`}
              value={activeFlow.value}
              hint={`${activeFlow.label}${'state' in activeFlow ? ` · ${activeFlow.state}` : ''}`}
              accent="cyan"
            />
            <DataFlowRibbon label="联动刷新" value="AUTO" hint="2s / cycle" accent="blue" />
            <DataFlowRibbon label="实时同步" value="99.2%" hint="mock -> api ready" accent="green" />
          </div>
        ) : null}
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
              <div className="hero-banner">
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
            <div className="distribution-radar-strip">
              <DistributionChart data={data.distribution} />
              <RadarChart data={data.radar} />
            </div>
          </section>

          <section className="bottom-stack">
            <AlertsPanel alerts={data.alerts} />
            <RealtimePanel data={data} activeIndex={tickerIndex % data.liveStreams.length} />
          </section>
        </main>
      </div>
    </div>
  );
}
