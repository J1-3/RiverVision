import type { DashboardSnapshot } from '@/entities/dashboard/model/types';

export const dashboardMock: DashboardSnapshot = {
  title: 'RiverVision',
  subtitle: '江视觉数据大屏 · 江河生态与城市运行监测',
  timestamp: '2026-07-07 09:42:18',
  metrics: [
    { label: '今日总流量', value: '28.6 万', delta: '+12.4%', tone: 'cyan' },
    { label: '监测节点', value: '186', delta: '+8', tone: 'blue' },
    { label: '异常告警', value: '03', delta: '-2', tone: 'gold' },
    { label: '数据健康度', value: '99.2%', delta: '+0.6%', tone: 'green' },
  ],
  trend: [
    { label: '00:00', value: 120 },
    { label: '03:00', value: 160 },
    { label: '06:00', value: 240 },
    { label: '09:00', value: 420 },
    { label: '12:00', value: 660 },
    { label: '15:00', value: 780 },
    { label: '18:00', value: 720 },
    { label: '21:00', value: 560 },
  ],
  distribution: [
    { label: '上游', value: 34, percent: 34 },
    { label: '中游', value: 41, percent: 41 },
    { label: '下游', value: 25, percent: 25 },
  ],
  alerts: [
    { title: '泵站瞬时负载波动', detail: '江北泵站 12 分钟内波动 18%', time: '09:21', severity: 'high' },
    { title: '数据节点延迟', detail: '滨河节点 2 条链路出现抖动', time: '09:14', severity: 'medium' },
    { title: '水质指标正常', detail: '7 个重点点位均处于安全区间', time: '08:58', severity: 'low' },
  ],
  liveStreams: [
    { label: '实时水位', value: '3.42m', state: '平稳上升' },
    { label: '流速监测', value: '1.87m/s', state: '轻微回落' },
    { label: '温度均值', value: '22.8℃', state: '绿色区间' },
  ],
  coverage: [
    { label: '传感器覆盖', value: 92 },
    { label: '链路在线率', value: 97 },
    { label: '可视化渗透', value: 88 },
  ],
  radar: [
    { name: '水质监测', value: 87 },
    { name: '数据采集', value: 92 },
    { name: '告警响应', value: 78 },
    { name: '可视化', value: 85 },
    { name: '教学互动', value: 70 },
    { name: '系统稳定', value: 94 },
  ],
};
