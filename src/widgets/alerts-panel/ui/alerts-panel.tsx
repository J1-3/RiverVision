import type { AlertItem } from '@/entities/dashboard/model/types';
import { Panel } from '@/shared/ui/panel/panel';
import { SectionTitle } from '@/shared/ui/section-title/section-title';

interface AlertsPanelProps {
  alerts: AlertItem[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <Panel title="告警中心" subtitle="重点状态与风险提示" className="alerts-panel">
      <SectionTitle title="Live Alerts" subtitle="异常事件与提醒" extra={`${alerts.length} 条`} />
      <div className="panel-list">
        {alerts.map((alert) => (
          <div key={`${alert.title}-${alert.time}`} className="list-item">
            <div>
              <strong>{alert.title}</strong>
              <span>{alert.detail}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="badge">{alert.severity}</div>
              <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
                {alert.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
