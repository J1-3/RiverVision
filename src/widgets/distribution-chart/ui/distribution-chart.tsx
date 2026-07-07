import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Panel } from '@/shared/ui/panel/panel';
import { SectionTitle } from '@/shared/ui/section-title/section-title';
import type { DistributionItem } from '@/entities/dashboard/model/types';

interface DistributionChartProps {
  data: DistributionItem[];
}

export function DistributionChart({ data }: DistributionChartProps) {
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
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: ['42%', '72%'],
          center: ['50%', '54%'],
          itemStyle: { borderColor: 'rgba(7, 19, 31, 0.9)', borderWidth: 4 },
          label: { color: '#dff5ff' },
          data: [],
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
      series: [
        {
          data: data.map((item, index) => ({
            name: item.label,
            value: item.value,
            itemStyle: {
              color: ['#2bd9ff', '#4f8cff', '#68f0b5'][index % 3],
            },
          })),
        },
      ],
    });
  }, [data]);

  return (
    <Panel title="空间分布" subtitle="江河流域数据分布结构" className="distribution-chart">
      <SectionTitle title="Regional Coverage" subtitle="分区占比统计" extra="3 区域" />
      <div ref={ref} style={{ width: '100%', height: 260 }} />
      <div className="compact-stack" style={{ marginTop: 10 }}>
        {data.map((item) => (
          <div key={item.label} className="progress">
            <div className="progress__row">
              <span>{item.label}</span>
              <strong>{item.percent}%</strong>
            </div>
            <div className="progress__bar">
              <i style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
