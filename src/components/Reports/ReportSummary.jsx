export default function ReportSummary({ summary }) {
  const items = [
    { label: 'Total Tasks', value: summary.total, color: 'var(--primary)', icon: 'fa-list-check' },
    { label: 'Completed', value: summary.completed, color: 'var(--success)', icon: 'fa-circle-check' },
    { label: 'In Progress', value: summary.inProgress, color: 'var(--info)', icon: 'fa-spinner' },
    { label: 'Pending', value: summary.pending, color: 'var(--warning)', icon: 'fa-clock' },
    { label: 'Overdue', value: summary.overdue, color: 'var(--danger)', icon: 'fa-triangle-exclamation' },
  ];
  return (
    <div className="stats-grid">
      {items.map((it) => (
        <div key={it.label} className="stat-card">
          <div className="stat-icon" style={{ background: it.color + '20', color: it.color }}>
            <i className={'fas ' + it.icon} />
          </div>
          <div>
            <div className="stat-value">{it.value}</div>
            <div className="stat-label">{it.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
