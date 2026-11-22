import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api.js';
import PersonalTaskCard from '../components/PersonalTasks/PersonalTaskCard.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import { SkCard } from '../components/UI/Skeleton.jsx';
import { STATUSES, PRIORITIES } from '../utils/constants.js';
import useDebounce from '../hooks/useDebounce.js';

export default function PersonalTasks() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    let dead = false;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
        if (debouncedSearch) params.append('search', debouncedSearch);
        const data = await api.get('/api/personal-tasks?' + params.toString());
        if (!dead) setTasks(data.tasks || []);
      } catch {}
      if (!dead) setLoading(false);
    })();
    return () => { dead = true; };
  }, [filters.status, filters.priority, debouncedSearch]);

  const clear = () => setFilters({ status: '', priority: '', search: '' });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">My Tasks</div>
          <div className="page-subtitle">Your personal task list — private to you</div>
        </div>
        <Link to="/personal-tasks/new" className="btn btn-primary">
          <i className="fas fa-plus" /> New Task
        </Link>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Status</label>
            <select className="form-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Priority</label>
            <select className="form-select" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
              <option value="">All</option>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Search</label>
            <input className="form-input" placeholder="Search..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          </div>
          <div>
            <button className="btn btn-outline btn-block" onClick={clear}>
              <i className="fas fa-rotate-left" /> Reset
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => <SkCard key={i} h={160} />)}
        </div>
      ) : tasks.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="fa-list-check"
            title="No personal tasks yet"
            text="Create your first personal task to get started"
            action={<Link to="/personal-tasks/new" className="btn btn-primary"><i className="fas fa-plus" /> New Task</Link>}
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {tasks.map((t) => <PersonalTaskCard key={t._id} task={t} />)}
        </div>
      )}
    </div>
  );
}