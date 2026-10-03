export function Sk({ w, h, r, className = '' }) {
  const style = {};
  if (w) style.width = typeof w === 'number' ? w + 'px' : w;
  if (h) style.height = typeof h === 'number' ? h + 'px' : h;
  if (r) style.borderRadius = r;
  return <div className={'sk ' + className} style={style} />;
}

export function SkText({ lines = 1, width = '100%', size = 'md' }) {
  const cls = size === 'lg' ? 'sk-text lg' : size === 'sm' ? 'sk-text sm' : 'sk-text';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={cls + ' sk'} style={{ width: i === lines - 1 && lines > 1 ? '65%' : width }} />
      ))}
    </div>
  );
}

export function SkCard({ h = 120 }) {
  return (
    <div className="sk-card">
      <div className="sk-col" style={{ gap: 12 }}>
        <div className="sk sk-text lg" style={{ width: '40%' }} />
        <div className="sk sk-text" style={{ width: '100%' }} />
        <div className="sk sk-text" style={{ width: '80%' }} />
      </div>
    </div>
  );
}

export function SkTable({ rows = 5, cols = 5 }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>{Array.from({ length: cols }).map((_, i) => <th key={i}><div className="sk sk-text" style={{ width: 80 }} /></th>)}</tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c}><div className="sk sk-text" style={{ width: c === 0 ? '70%' : 60 }} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkStats({ count = 5 }) {
  return (
    <div className="stats-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="sk-stat">
          <div className="sk sk-circle" />
          <div className="sk-col">
            <div className="sk sk-text lg" style={{ width: 40 }} />
            <div className="sk sk-text sm" style={{ width: 70 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BootSkeleton() {
  return (
    <div className="boot-screen">
      <div className="boot-header">
        <div className="sk" style={{ width: 180, height: 32, borderRadius: 10 }} />
        <div className="sk" style={{ width: 200, height: 36, borderRadius: 10 }} />
      </div>
      <div className="sk sk-text lg" style={{ width: 220, height: 26, marginBottom: 6 }} />
      <div className="sk sk-text sm" style={{ width: 180, marginBottom: 24 }} />
      <div className="boot-stats">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="sk-stat">
            <div className="sk sk-circle" />
            <div className="sk-col">
              <div className="sk sk-text lg" style={{ width: 40 }} />
              <div className="sk sk-text sm" style={{ width: 70 }} />
            </div>
          </div>
        ))}
      </div>
      <div className="boot-row">
        <div className="sk-card"><div className="sk sk-chart" /></div>
        <div className="sk-card"><div className="sk sk-chart" /></div>
      </div>
      <div className="sk-card" style={{ marginTop: 20 }}>
        <div className="sk sk-line" />
        <div className="sk sk-line" />
        <div className="sk sk-line" />
        <div className="sk sk-line" />
      </div>
    </div>
  );
}
