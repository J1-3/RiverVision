import type { DashboardSnapshot } from '@/entities/dashboard/model/types';
import { Panel } from '@/shared/ui/panel/panel';
import { SectionTitle } from '@/shared/ui/section-title/section-title';

interface RealtimePanelProps {
  data: DashboardSnapshot;
}

export function RealtimePanel({ data }: RealtimePanelProps) {
  return (
    <Panel title="实时态势" subtitle="持续刷新中的数据流" className="realtime-panel">
      <SectionTitle title="Realtime Stream" subtitle="核心指标动态变化" extra="Live" />
      <div className="panel-list">
        {data.liveStreams.map((item) => (
          <div key={item.label} className="list-item">
            <div>
              <strong>{item.label}</strong>
              <span>{item.state}</span>
            </div>
            <div className="badge" style={{ minWidth: 86, justifyContent: 'center' }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
      <div className="soft-card" style={{ marginTop: 14 }}>
        <SectionTitle title="Coverage" subtitle="系统可视化覆盖" />
        <div className="compact-stack">
          {data.coverage.map((item) => (
            <div key={item.label} className="progress">
              <div className="progress__row">
                <span>{item.label}</span>
                <strong>{item.value}%</strong>
              </div>
              <div className="progress__bar">
                <i style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
