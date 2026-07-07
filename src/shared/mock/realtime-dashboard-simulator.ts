import type { AlertItem, DashboardSnapshot } from '@/entities/dashboard/model/types';
import { dashboardMock } from './dashboard-data';

type DistributionState = {
  upstream: number;
  midstream: number;
  downstream: number;
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function parseFirstNumber(value: string): number {
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

function formatFlow(value: number): string {
  return `${value.toFixed(1)} 万`;
}

function formatHealth(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatStream(value: number, unit: string): string {
  if (unit === 'm') return `${value.toFixed(2)}m`;
  if (unit === 'm/s') return `${value.toFixed(2)}m/s`;
  return `${value.toFixed(1)}${unit}`;
}

function buildDelta(oldValue: number, newValue: number, suffix = ''): string {
  if (oldValue === 0) return `+${newValue.toFixed(1)}${suffix}`;
  const diff = newValue - oldValue;
  const pct = ((diff / oldValue) * 100).toFixed(1);
  const sign = diff >= 0 ? '+' : '';
  return `${sign}${pct}%${suffix}`;
}

function getStreamState(current: number, previous: number | undefined): string {
  if (previous === undefined) return '区间稳定';
  const diff = current - previous;
  if (diff > 0.02) return '平稳上升';
  if (diff < -0.02) return '轻微回落';
  return '区间稳定';
}

const ALERT_TEMPLATES = [
  { title: '上游水文站完成新一轮水位数据同步', detail: '东江流域 5 个监测点数据已入库', severity: 'low' as const },
  { title: '传感器案例库同步 12 条练习记录', detail: '教学数据集已更新至最新版本', severity: 'low' as const },
  { title: '水质监测点新增一批观测数据提交', detail: '本批次共 48 条新记录', severity: 'medium' as const },
  { title: '教学平台发布新的可视化作业任务', detail: '学员可在实验环境中运行代码', severity: 'low' as const },
  { title: '数据质量巡检通过，异常值已自动标记', detail: '本次巡检覆盖 186 个数据通道', severity: 'low' as const },
  { title: '华东节点接口延迟轻微升高，已切换备用通道', detail: '延迟从 12ms 升高至 35ms', severity: 'medium' as const },
  { title: '告警中心发现轻微波动，正在持续观察', detail: '江北泵站瞬时负载波动 18%', severity: 'medium' as const },
  { title: '泵站数据区新增高频问题聚类结果', detail: '识别出 3 类高频异常模式', severity: 'low' as const },
  { title: '河道流速异常检测模块触发阈值', detail: '流速超过历史同期均值 2.1 倍', severity: 'high' as const },
  { title: '可视化渲染服务内存使用率升高', detail: '当前占用率 78%，建议扩容', severity: 'medium' as const },
];

let tickCount = 0;
let current: DashboardSnapshot = structuredClone(dashboardMock);

function updateMetrics(snapshot: DashboardSnapshot): void {
  const metrics = snapshot.metrics;
  const oldFlow = parseFirstNumber(metrics[0].value);
  const oldNodes = parseFirstNumber(metrics[1].value);
  const oldAlerts = parseFirstNumber(metrics[2].value);
  const oldHealth = parseFirstNumber(metrics[3].value);

  const newFlow = oldFlow + randomInt(500, 5000);
  const newNodes = clamp(oldNodes + randomInt(-2, 5), 100, 999);
  const newAlerts = clamp(oldAlerts + randomInt(-1, 2), 0, 99);
  const newHealth = clamp(oldHealth + randomFloat(-1.5, 0.5), 95, 99.9);

  metrics[0] = { ...metrics[0], value: formatFlow(newFlow), delta: buildDelta(oldFlow, newFlow) };
  metrics[1] = { ...metrics[1], value: String(newNodes), delta: `+${newNodes - oldNodes}` };
  metrics[2] = { ...metrics[2], value: String(newAlerts).padStart(2, '0'), delta: buildDelta(oldAlerts, newAlerts) };
  metrics[3] = { ...metrics[3], value: formatHealth(newHealth), delta: buildDelta(oldHealth, newHealth) };
}

function updateTrend(snapshot: DashboardSnapshot): void {
  const trend = snapshot.trend;
  const last = trend[trend.length - 1];
  const lastValue = last ? last.value : 200;
  const newValue = clamp(lastValue + randomInt(5, 20), 100, 900);
  const now = new Date();
  const label = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  trend.push({ label, value: newValue });
  while (trend.length > 10) {
    trend.shift();
  }
}

function updateLiveStreams(snapshot: DashboardSnapshot): void {
  const streams = snapshot.liveStreams;
  const prevValues: number[] = streams.map((item) => parseFirstNumber(item.value));

  streams[0] = {
    ...streams[0],
    value: formatStream(clamp(parseFirstNumber(streams[0].value) + randomFloat(-0.05, 0.05), 2.5, 4.5), 'm'),
    state: getStreamState(parseFirstNumber(streams[0].value), prevValues[0]),
  };
  streams[1] = {
    ...streams[1],
    value: formatStream(clamp(parseFirstNumber(streams[1].value) + randomFloat(-0.1, 0.1), 1.0, 2.5), 'm/s'),
    state: getStreamState(parseFirstNumber(streams[1].value), prevValues[1]),
  };
  streams[2] = {
    ...streams[2],
    value: formatStream(clamp(parseFirstNumber(streams[2].value) + randomFloat(-0.3, 0.3), 20.0, 26.0), '℃'),
    state: getStreamState(parseFirstNumber(streams[2].value), prevValues[2]),
  };
}

function createAlert(severity: AlertItem['severity']): AlertItem {
  const template = ALERT_TEMPLATES[randomInt(0, ALERT_TEMPLATES.length - 1)];
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return {
    title: template.title,
    detail: template.detail,
    time,
    severity,
  };
}

function updateAlerts(snapshot: DashboardSnapshot): void {
  const alerts = snapshot.alerts;
  const severityPool: AlertItem['severity'][] = [];
  for (let i = 0; i < 4; i++) {
    const roll = Math.random();
    severityPool.push(roll < 0.2 ? 'high' : roll < 0.7 ? 'medium' : 'low');
  }

  const newAlert = createAlert(severityPool[randomInt(0, severityPool.length - 1)]);
  alerts.unshift(newAlert);
  while (alerts.length > 5) {
    alerts.pop();
  }
}

function normalizeDistribution(state: DistributionState): DistributionState {
  const total = Math.max(1, state.upstream + state.midstream + state.downstream);
  const raw = [state.upstream / total, state.midstream / total, state.downstream / total];
  const rounded = raw.map((v) => Math.round(v * 100));
  let diff = 100 - rounded.reduce((a, b) => a + b, 0);
  let idx = 0;
  while (diff !== 0) {
    rounded[idx % 3] += diff > 0 ? 1 : -1;
    diff += diff > 0 ? -1 : 1;
    idx++;
  }
  return { upstream: rounded[0], midstream: rounded[1], downstream: rounded[2] };
}

function updateDistribution(snapshot: DashboardSnapshot): void {
  const dist = snapshot.distribution;
  const state: DistributionState = {
    upstream: dist[0].value + randomInt(-2, 2),
    midstream: dist[1].value + randomInt(-2, 2),
    downstream: dist[2].value + randomInt(-2, 2),
  };
  const normalized = normalizeDistribution(state);
  dist[0] = { ...dist[0], value: normalized.upstream, percent: normalized.upstream };
  dist[1] = { ...dist[1], value: normalized.midstream, percent: normalized.midstream };
  dist[2] = { ...dist[2], value: normalized.downstream, percent: normalized.downstream };
}

function updateCoverage(snapshot: DashboardSnapshot): void {
  const coverage = snapshot.coverage;
  for (let i = 0; i < coverage.length; i++) {
    const oldValue = coverage[i].value;
    coverage[i] = {
      ...coverage[i],
      value: clamp(oldValue + randomInt(-1, 3), 80, 100),
    };
  }
}

function updateRadar(snapshot: DashboardSnapshot): void {
  const radar = snapshot.radar;
  for (let i = 0; i < radar.length; i++) {
    radar[i] = {
      ...radar[i],
      value: clamp(radar[i].value + randomInt(-2, 2), 60, 100),
    };
  }
}

export function getNextDashboardSnapshot(): DashboardSnapshot {
  tickCount += 1;

  const next = structuredClone(current);

  updateMetrics(next);

  if (tickCount % 2 === 0) {
    updateTrend(next);
  }

  if (tickCount % 2 === 0) {
    updateLiveStreams(next);
  }

  if (tickCount % 5 === 0) {
    updateAlerts(next);
  }

  if (tickCount % 10 === 0) {
    updateDistribution(next);
  }

  if (tickCount % 8 === 0) {
    updateCoverage(next);
  }

  if (tickCount % 15 === 0) {
    updateRadar(next);
  }

  next.timestamp = new Date().toLocaleString('zh-CN', { hour12: false });

  current = structuredClone(next);
  return next;
}

export function resetSimulator(): void {
  tickCount = 0;
  current = structuredClone(dashboardMock);
}
