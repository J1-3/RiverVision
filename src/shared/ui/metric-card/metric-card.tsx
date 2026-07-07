import type { MetricItem } from '@/entities/dashboard/model/types';

type MetricCardProps = MetricItem;

export function MetricCard({ label, value, delta, tone }: MetricCardProps) {
  return (
    <article className={`soft-card metric-card metric-card--${tone}`}>
      <div className="muted" style={{ fontSize: 12, letterSpacing: '0.08em' }}>
        {label}
      </div>
      <div style={{ marginTop: 10, fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>{value}</div>
      <div className="badge" style={{ marginTop: 12 }}>
        {delta}
      </div>
    </article>
  );
}
