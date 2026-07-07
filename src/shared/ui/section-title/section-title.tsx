interface SectionTitleProps {
  title: string;
  subtitle?: string;
  extra?: string;
}

export function SectionTitle({ title, subtitle, extra }: SectionTitleProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'end', marginBottom: 14 }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 18, letterSpacing: '0.04em' }}>{title}</h3>
        {subtitle ? <p className="panel__subtitle">{subtitle}</p> : null}
      </div>
      {extra ? <span className="badge">{extra}</span> : null}
    </div>
  );
}
