import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { BootSkeleton } from '../components/UI/Skeleton.jsx';
import TaskStatusBadge from '../components/Tasks/TaskStatusBadge.jsx';
import TaskPriorityBadge from '../components/Tasks/TaskPriorityBadge.jsx';
import { fmtDate, daysUntil } from '../utils/formatDate.js';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get('/api/tasks/my-tasks');
        setTasks(data.tasks || []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) return <BootSkeleton />;

  const assigned = tasks.length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const overdue = tasks.filter((t) => new Date(t.deadline) < new Date() && t.status !== 'Completed').length;

  const upcoming = tasks
    .filter((t) => t.status !== 'Completed')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</div>
          <div className="page-subtitle">Here's what's happening with your tasks today.</div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon="fa-list-check" color="red" value={assigned} label="Assigned Tasks" />
        <StatCard icon="fa-spinner" color="orange" value={inProgress} label="In Progress" />
        <StatCard icon="fa-circle-check" color="green" value={completed} label="Completed" />
        <StatCard icon="fa-triangle-exclamation" color="red" value={overdue} label="Overdue" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-clipboard-list" style={{ color: 'var(--primary)' }} /> My Tasks</h3>
            <Link to="/tasks" style={{ fontSize: 12.5, color: 'var(--primary)', fontWeight: 600 }}>View all</Link>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: 30, color: 'var(--text-3)' }}>No tasks assigned yet</td></tr>}
                {tasks.slice(0, 6).map((t) => (
                  <tr key={t._id}>
                    <td><Link to={'/task/' + t._id} style={{ fontWeight: 600, color: 'var(--text)' }}>{t.title}</Link></td>
                    <td><TaskPriorityBadge priority={t.priority} /></td>
                    <td><TaskStatusBadge status={t.status} /></td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-2)' }}>{fmtDate(t.deadline)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-clock" style={{ color: 'var(--primary)' }} /> Upcoming Deadlines</h3>
          </div>
          <div style={{ padding: 16 }}>
            {upcoming.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: 30, fontSize: 13 }}>No upcoming deadlines</div>}
            {upcoming.map((t) => {
              const days = daysUntil(t.deadline);
              const cls = days !== null && days < 0 ? 'high' : days <= 2 ? 'medium' : 'low';
              return (
                <Link key={t._id} to={'/task/' + t._id} style={{
                  display: 'flex', gap: 12, padding: '12px 10px', borderRadius: 10,
                  alignItems: 'center', marginBottom: 6,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'var(--primary-light)', color: 'var(--primary)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    lineHeight: 1, flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{new Date(t.deadline).getDate()}</span>
                    <span style={{ fontSize: 9.5, textTransform: 'uppercase' }}>
                      {new Date(t.deadline).toLocaleString('en-US', { month: 'short' })}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
                      {days < 0 ? 'Overdue' : days === 0 ? 'Due today' : 'Due in ' + days + ' day' + (days > 1 ? 's' : '')}
                    </div>
                  </div>
                  <span className={'badge ' + cls}>{t.priority}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, color, value, label }) {
  return (
    <div className="stat-card">
      <div className={'stat-icon ' + color}><i className={'fas ' + icon} /></div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
