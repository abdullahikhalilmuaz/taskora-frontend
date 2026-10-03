export default function TaskPriorityBadge({ priority }) {
  const cls = 'badge ' + String(priority || '').toLowerCase();
  return <span className={cls}>{priority}</span>;
}
