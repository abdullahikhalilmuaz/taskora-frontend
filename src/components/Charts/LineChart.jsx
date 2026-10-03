export default function LineChart({ data, height = 160 }) {
  if (!data || !data.length) return null;
  const w = 500;
  const max = Math.max(...data.map((d) => d.value), 1);
  const step = w / Math.max(1, data.length - 1);
  const points = data.map((d, i) => [i * step, height - (d.value / max) * (height - 20) - 10]);
  const path = points.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ' ' + p[1]).join(' ');
  const area = path + ' L ' + w + ' ' + height + ' L 0 ' + height + ' Z';

  return (
    <svg viewBox={'0 0 ' + w + ' ' + height} style={{ width: '100%', height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lineGrad)" />
      <path d={path} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#fff" stroke="var(--primary)" strokeWidth="2" />
      ))}
    </svg>
  );
}
