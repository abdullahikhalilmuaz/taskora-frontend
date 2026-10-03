export default function TaskStatusBadge({ status }) {
  const cls = 'badge ' + String(status || '').toLowerCase().replace(/\s+/g, '-');
  return <span className={cls}>{status}</span>;
}
