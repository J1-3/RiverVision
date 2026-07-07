import type { PropsWithChildren } from 'react';

interface PanelProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  className?: string;
}

export function Panel({ title, subtitle, className = '', children }: PanelProps) {
  return (
    <section className={`panel ${className}`.trim()}>
      <h2 className="panel__title">{title}</h2>
      {subtitle ? <p className="panel__subtitle">{subtitle}</p> : null}
      {children}
    </section>
  );
}
