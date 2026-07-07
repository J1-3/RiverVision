export interface MetricItem {
  label: string;
  value: string;
  delta: string;
  tone: 'cyan' | 'blue' | 'green' | 'gold';
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface DistributionItem {
  label: string;
  value: number;
  percent: number;
}

export interface AlertItem {
  title: string;
  detail: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
}

export interface DashboardSnapshot {
  title: string;
  subtitle: string;
  timestamp: string;
  metrics: MetricItem[];
  trend: TrendPoint[];
  distribution: DistributionItem[];
  alerts: AlertItem[];
  liveStreams: Array<{ label: string; value: string; state: string }>;
  coverage: Array<{ label: string; value: number }>;
}
