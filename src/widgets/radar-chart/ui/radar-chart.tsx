import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Panel } from '@/shared/ui/panel/panel';
import { SectionTitle } from '@/shared/ui/section-title/section-title';
import type { RadarItem } from '@/entities/dashboard/model/types';

interface RadarChartProps {
  data: RadarItem[];
}

export function RadarChart({ data }: RadarChartProps) {
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
      radar: {
        indicator: [] as Array<{ name: string; max: number }>,
        shape: 'polygon',
        splitNumber: 4,
        axisName: {
          color: '#93c8da',
          fontSize: 12,
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.08)',
          },
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(43, 217, 255, 0.02)', 'rgba(43, 217, 255, 0.04)'],
          },
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(142, 198, 220, 0.25)',
          },
        },
      },
      series: [
        {
          type: 'radar',
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#2bd9ff',
            width: 2,
          },
          areaStyle: {
            color: 'rgba(43, 217, 255, 0.18)',
          },
          itemStyle: {
            color: '#68f0b5',
          },
          data: [] as Array<{ value: number[]; name: string }>,
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
    if (!chartRef.current) {
      return;
    }

    chartRef.current.setOption({
      radar: {
        indicator: data.map((item) => ({ name: item.name, max: 100 })),
      },
      series: [
        {
          data: [
            {
              value: data.map((item) => item.value),
              name: '综合能力',
            },
          ],
        },
      ],
    });
  }, [data]);

  return (
    <Panel title="能力雷达" subtitle="六大维度综合评估" className="radar-chart">
      <SectionTitle title="Radar" subtitle="低频刷新 30s+" extra="6 维度" />
      <div ref={ref} style={{ width: '100%', height: 280 }} />
    </Panel>
  );
}
