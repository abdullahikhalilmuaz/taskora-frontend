import { Link } from 'react-router-dom';
import TaskStatusBadge from './TaskStatusBadge.jsx';
import TaskPriorityBadge from './TaskPriorityBadge.jsx';
import Avatar from '../UI/Avatar.jsx';
import { fmtDate, daysUntil } from '../../utils/formatDate.js';

export default function TaskCard({ task }) {
  const days = daysUntil(task.deadline);
  const overdue = days !== null && days < 0 && task.status !== 'Completed';

  return (
    <Link to={'/task/' + task._id} className="card anim-fade-up" style={{ padding: 18, display: 'block', transition: 'transform .2s, box-shadow .2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <h4 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{task.title}</h4>
        <TaskPriorityBadge priority={task.priority} />
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {task.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Avatar user={task.assignedTo} size={26} />
        <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>{task.assignedTo?.name}</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: overdue ? 'var(--danger)' : 'var(--text-3)' }}>
          <i className="far fa-calendar" /> {fmtDate(task.deadline)}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TaskStatusBadge status={task.status} />
        <div style={{ display: 'flex', gap: 12, color: 'var(--text-3)', fontSize: 12 }}>
          <span><i className="far fa-comment" /> {task.comments?.length || 0}</span>
          <span><i className="fas fa-clock-rotate-left" /> {task.history?.length || 0}</span>
        </div>
      </div>
    </Link>
  );
}
