interface DataFlowRibbonProps {
  label: string;
  value: string;
  hint: string;
  accent?: 'cyan' | 'blue' | 'green' | 'gold';
}

export function DataFlowRibbon({ label, value, hint, accent = 'cyan' }: DataFlowRibbonProps) {
  return (
    <div className={`data-flow-ribbon data-flow-ribbon--${accent}`}>
      <span className="data-flow-ribbon__label">{label}</span>
      <strong className="data-flow-ribbon__value">{value}</strong>
      <span className="data-flow-ribbon__hint">{hint}</span>
      <i className="data-flow-ribbon__pulse" aria-hidden="true" />
      <i className="data-flow-ribbon__trail" aria-hidden="true" />
    </div>
  );
}
