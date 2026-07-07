import { useState, useEffect } from 'react';
import type { AlertItem } from '@/entities/dashboard/model/types';
import { Panel } from '@/shared/ui/panel/panel';
import { SectionTitle } from '@/shared/ui/section-title/section-title';

interface AlertsPanelProps {
  alerts: AlertItem[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!alerts.length) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % alerts.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [alerts.length]);

  if (!alerts.length) {
    return (
      <Panel title="告警中心" subtitle="重点状态与风险提示" className="alerts-panel">
        <SectionTitle title="Live Alerts" subtitle="异常事件与提醒" extra="0 条" />
      </Panel>
    );
  }

  const alert = alerts[index];

  return (
    <Panel title="告警中心" subtitle="重点状态与风险提示" className="alerts-panel">
      <SectionTitle title="Live Alerts" subtitle="异常事件与提醒" extra={`${alerts.length} 条`} />
      <div className="alert-carousel">
        <div key={index} className={`alert-card alert-card--${alert.severity}`}>
          <div className="alert-card__indicator" />
          <div className="alert-card__body">
            <strong>{alert.title}</strong>
            <span>{alert.detail}</span>
          </div>
          <div className="alert-card__meta">
            <div className="badge badge--pulse">{alert.severity}</div>
            <div className="muted" style={{ fontSize: 12 }}>{alert.time}</div>
          </div>
        </div>
        <div className="alert-carousel__progress" key={`progress-${index}`} />
      </div>
    </Panel>
  );
}
