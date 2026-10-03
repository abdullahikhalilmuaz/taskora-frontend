export default function Badge({ children, variant = 'low' }) {
  const cls = 'badge ' + String(variant).toLowerCase().replace(/\s+/g, '-');
  return <span className={cls}>{children}</span>;
}
