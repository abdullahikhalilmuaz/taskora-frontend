import { STATUSES, PRIORITIES, DEPARTMENTS } from '../../utils/constants.js';

export default function TaskFilters({ value, onChange, onClear }) {
  const update = (k) => (e) => onChange({ ...value, [k]: e.target.value });

  return (
    <div className="card" style={{ padding: 14, marginBottom: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, alignItems: 'end' }}>
        <div>
          <label style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Status</label>
          <select className="form-select" value={value.status} onChange={update('status')}>
            <option value="">All Status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Priority</label>
          <select className="form-select" value={value.priority} onChange={update('priority')}>
            <option value="">All Priority</option>
            {PRIORITIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Department</label>
          <select className="form-select" value={value.department} onChange={update('department')}>
            <option value="">All Departments</option>
            {DEPARTMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Search</label>
          <input className="form-input" placeholder="Search tasks..." value={value.search} onChange={update('search')} />
        </div>
        <div>
          <button className="btn btn-outline btn-block" onClick={onClear}>
            <i className="fas fa-rotate-left" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
