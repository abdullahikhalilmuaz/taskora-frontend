export default function BarChart({ data, height = 160 }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height, padding: '10px 0' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
            <div
              style={{
                width: '100%',
                height: (d.value / max) * 100 + '%',
                background: d.color || 'var(--primary)',
                borderRadius: '8px 8px 4px 4px',
                minHeight: d.value > 0 ? 6 : 3,
                transition: 'height .4s ease',
              }}
              title={d.value}
            />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', textAlign: 'center', whiteSpace: 'nowrap' }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}
