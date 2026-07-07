import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Panel } from '@/shared/ui/panel/panel';
import { SectionTitle } from '@/shared/ui/section-title/section-title';
import type { TrendPoint } from '@/entities/dashboard/model/types';

interface TrendChartProps {
  data: TrendPoint[];
}

export function TrendChart({ data }: TrendChartProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const element = ref.current;
    const chart = echarts.init(element);
    chartRef.current = chart;
    chart.setOption({
      grid: { left: 36, right: 18, top: 28, bottom: 28 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: [] as string[],
        axisLine: { lineStyle: { color: 'rgba(142, 198, 220, 0.5)' } },
        axisLabel: { color: '#93c8da' },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.08)' } },
        axisLabel: { color: '#93c8da' },
      },
      series: [
        {
          data: [] as number[],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { color: '#2bd9ff', width: 3 },
          itemStyle: { color: '#68f0b5' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(43, 217, 255, 0.45)' },
              { offset: 1, color: 'rgba(43, 217, 255, 0.02)' },
            ]),
          },
        },
      ],
    });

    const observer = new ResizeObserver(() => {
      chart?.resize();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !data) {
      return;
    }

    chartRef.current.setOption({
      xAxis: {
        data: data.map((item) => item.label),
      },
      series: [
        {
          data: data.map((item) => item.value),
        },
      ],
    });
  }, [data]);

  return (
    <Panel title="趋势分析" subtitle="全天流量变化与峰值走势" className="trend-chart">
      <SectionTitle title="River Flow Trend" subtitle="实时变化趋势线" extra="更新频率 2s" />
      <div ref={ref} style={{ width: '100%', height: 280 }} />
    </Panel>
  );
}
