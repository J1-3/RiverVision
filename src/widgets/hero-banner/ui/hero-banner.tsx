import type { DashboardSnapshot } from '@/entities/dashboard/model/types';

interface HeroBannerProps {
  data?: DashboardSnapshot;
}

export function HeroBanner({ data }: HeroBannerProps) {
  if (!data) {
    return (
      <div className="hero-banner">
        <div>
          <div className="badge">RiverVision / 江视觉数据大屏</div>
          <h1 className="hero-banner__title" style={{ marginTop: 12 }}>
            正在加载 <span>江河视觉驾驶舱</span>
          </h1>
          <p className="panel__subtitle">正在从 mock 数据层读取运行态快照，后续可无缝切换 API。</p>
        </div>
        <div className="hero-banner__orbit">
          <div className="hero-banner__ring" />
          <div className="hero-banner__glow" />
        </div>
      </div>
    );
  }

  return (
    <div className="hero-banner">
      <div>
        <div className="badge">RiverVision / 江视觉数据大屏</div>
        <h1 className="hero-banner__title" style={{ marginTop: 12 }}>
          {data.title} <span>{data.subtitle}</span>
        </h1>
        <p className="panel__subtitle">{data.timestamp} · 江河生态、设备运行与告警信息统一可视化监测</p>
        <div className="hero-banner__meta">
          {data.metrics.slice(0, 3).map((item) => (
            <div key={item.label} className="hero-banner__stat">
              <div className="hero-banner__stat-value">{item.value}</div>
              <div className="hero-banner__stat-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="hero-banner__orbit">
        <div className="hero-banner__ring" />
        <div className="hero-banner__glow" />
      </div>
    </div>
  );
}
