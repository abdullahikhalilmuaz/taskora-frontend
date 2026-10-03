export default function ReportFilters({ value, onChange, onGenerate, loading }) {
  const update = (k) => (e) => onChange({ ...value, [k]: e.target.value });

  return (
    <div className="card" style={{ padding: 16, marginBottom: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, alignItems: 'end' }}>
        <div>
          <label style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Report Type</label>
          <select className="form-select" value={value.type} onChange={update('type')}>
            <option value="completion">Task Completion Report</option>
            <option value="employee">Employee Performance Report</option>
            <option value="department">Department Overview Report</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Start Date</label>
          <input type="date" className="form-input" value={value.startDate} onChange={update('startDate')} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, display: 'block', marginBottom: 6 }}>End Date</label>
          <input type="date" className="form-input" value={value.endDate} onChange={update('endDate')} />
        </div>
        <div>
          <button className="btn btn-primary btn-block" onClick={onGenerate} disabled={loading}>
            {loading ? <><i className="fas fa-circle-notch spin" /> Generating...</> : <><i className="fas fa-chart-pie" /> Generate</>}
          </button>
        </div>
      </div>
    </div>
  );
}
