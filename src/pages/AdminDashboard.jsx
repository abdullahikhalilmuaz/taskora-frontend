import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { SkStats, SkCard, SkTable, BootSkeleton } from '../components/UI/Skeleton.jsx';
import DonutChart from '../components/Charts/DonutChart.jsx';
import BarChart from '../components/Charts/BarChart.jsx';
import Avatar from '../components/UI/Avatar.jsx';
import TaskStatusBadge from '../components/Tasks/TaskStatusBadge.jsx';
import TaskPriorityBadge from '../components/Tasks/TaskPriorityBadge.jsx';
import { fmtDate } from '../utils/formatDate.js';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ employees: 0, tasks: 0, completed: 0, pending: 0, overdue: 0 });
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const [tRes, eRes] = await Promise.all([
          api.get('/api/tasks'),
          api.get('/api/users/employees'),
        ]);
        if (dead) return;
        const list = tRes.tasks || [];
        setTasks(list.slice(0, 6));
        setEmployees((eRes.employees || []).slice(0, 6));

        const completed = list.filter((t) => t.status === 'Completed').length;
        const pending = list.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
        const overdue = list.filter((t) => new Date(t.deadline) < new Date() && t.status !== 'Completed').length;

        setStats({
          employees: eRes.count || 0,
          tasks: list.length,
          completed,
          pending,
          overdue,
        });

        const byDept = {};
        list.forEach((t) => {
          byDept[t.department] = byDept[t.department] || { total: 0, completed: 0 };
          byDept[t.department].total++;
          if (t.status === 'Completed') byDept[t.department].completed++;
        });
        setDepartments(Object.entries(byDept).map(([k, v]) => ({ name: k, ...v })).slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        if (!dead) setLoading(false);
      }
    })();
    return () => { dead = true; };
  }, []);

  if (loading) return <BootSkeleton />;

  const donutData = [
    { label: 'Completed', value: stats.completed, color: '#10b981' },
    { label: 'In Progress', value: tasks.filter((t) => t.status === 'In Progress').length, color: '#3b82f6' },
    { label: 'Pending', value: tasks.filter((t) => t.status === 'Pending').length, color: '#f59e0b' },
    { label: 'On Hold', value: tasks.filter((t) => t.status === 'On Hold').length, color: '#9ca3af' },
  ];

  const barData = departments.map((d) => ({ label: d.name, value: d.total, color: 'var(--primary)' }));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Admin Dashboard</div>
          <div className="page-subtitle">Welcome back, {user?.name?.split(' ')[0]}</div>
        </div>
        <Link to="/tasks/new" className="btn btn-primary">
          <i className="fas fa-plus" /> New Task
        </Link>
      </div>

      <div className="stats-grid">
        <StatCard icon="fa-users" color="red" value={stats.employees} label="Total Employees" />
        <StatCard icon="fa-list-check" color="purple" value={stats.tasks} label="Total Tasks" />
        <StatCard icon="fa-circle-check" color="green" value={stats.completed} label="Completed" />
        <StatCard icon="fa-clock" color="orange" value={stats.pending} label="Pending" />
        <StatCard icon="fa-triangle-exclamation" color="red" value={stats.overdue} label="Overdue" />
      </div>

      <div className="grid-2-even" style={{ marginBottom: 22 }}>
        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-chart-pie" style={{ color: 'var(--primary)' }} /> Task Overview</h3>
          </div>
          <div style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <DonutChart data={donutData} />
            <div style={{ flex: 1, minWidth: 160 }}>
              {donutData.map((d) => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                  <span style={{ fontSize: 13, flex: 1 }}>{d.label}</span>
                  <strong style={{ fontSize: 13 }}>{d.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-building" style={{ color: 'var(--primary)' }} /> Department Overview</h3>
          </div>
          <div style={{ padding: '20px 24px' }}>
            {barData.length > 0 ? <BarChart data={barData} /> : <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: 40, fontSize: 13 }}>No data yet</div>}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-clock-rotate-left" style={{ color: 'var(--primary)' }} /> Recent Tasks</h3>
            <Link to="/tasks" style={{ fontSize: 12.5, color: 'var(--primary)', fontWeight: 600 }}>View all</Link>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 30, color: 'var(--text-3)' }}>No tasks yet</td></tr>}
                {tasks.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <Link to={'/task/' + t._id} style={{ fontWeight: 600, color: 'var(--text)' }}>{t.title}</Link>
                    </td>
                    <td><TaskPriorityBadge priority={t.priority} /></td>
                    <td><TaskStatusBadge status={t.status} /></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar user={t.assignedTo} size={26} />
                        <span style={{ fontSize: 12.5 }}>{t.assignedTo?.name?.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-2)' }}>{fmtDate(t.deadline)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-users" style={{ color: 'var(--primary)' }} /> Employees</h3>
            <Link to="/employees" style={{ fontSize: 12.5, color: 'var(--primary)', fontWeight: 600 }}>View all</Link>
          </div>
          <div style={{ padding: '8px 8px 16px' }}>
            {employees.map((e) => (
              <div key={e._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10 }}>
                <Avatar user={e} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{e.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{e.department} · {e.designation}</div>
                </div>
                <span className={'badge ' + (e.isActive ? 'active' : 'inactive')}>{e.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            ))}
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
