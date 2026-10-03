import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import EmployeeTable from '../components/Employees/EmployeeTable.jsx';
import Modal from '../components/UI/Modal.jsx';
import Button from '../components/UI/Button.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import { SkTable, SkStats } from '../components/UI/Skeleton.jsx';

export default function Employees() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [resetTarget, setResetTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('Welcome123');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const data = await api.get('/api/users/employees');
      setEmployees(data.employees || []);
    } catch (e) {
      toast.error(e.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    (e.department || '').toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = employees.filter((e) => e.isActive).length;
  const inactiveCount = employees.length - activeCount;

  const doReset = async () => {
    setBusy(true);
    try {
      await api.put('/api/users/' + resetTarget._id + '/reset-password', { newPassword });
      toast.success('Password reset');
      setResetTarget(null);
    } catch (e) {
      toast.error(e.message || 'Failed to reset');
    } finally {
      setBusy(false);
    }
  };

  const doDelete = async () => {
    setBusy(true);
    try {
      await api.del('/api/users/' + deleteTarget._id);
      toast.success('Employee deleted');
      setDeleteTarget(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to delete');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Employees</div>
          <div className="page-subtitle">Manage employee accounts</div>
        </div>
        <Link to="/register" className="btn btn-primary"><i className="fas fa-user-plus" /> Add Employee</Link>
      </div>

      {loading ? (
        <>
          <SkStats count={4} />
          <div className="card"><SkTable rows={6} cols={6} /></div>
        </>
      ) : (
        <>
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="stat-card">
              <div className="stat-icon red"><i className="fas fa-users" /></div>
              <div><div className="stat-value">{employees.length}</div><div className="stat-label">Total</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><i className="fas fa-user-check" /></div>
              <div><div className="stat-value">{activeCount}</div><div className="stat-label">Active</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange"><i className="fas fa-user-slash" /></div>
              <div><div className="stat-value">{inactiveCount}</div><div className="stat-label">Inactive</div></div>
            </div>
          </div>

          <div className="card">
            <div style={{ padding: 16, borderBottom: '1px solid var(--border-2)' }}>
              <input className="form-input" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {filtered.length === 0 ? (
              <EmptyState icon="fa-users" title="No employees found" />
            ) : (
              <EmployeeTable employees={filtered} onReset={setResetTarget} onDelete={setDeleteTarget} />
            )}
          </div>
        </>
      )}

      <Modal
        open={!!resetTarget}
        onClose={() => setResetTarget(null)}
        title="Reset Password"
        footer={<>
          <Button variant="outline" onClick={() => setResetTarget(null)}>Cancel</Button>
          <Button loading={busy} onClick={doReset}>Reset</Button>
        </>}
      >
        <p style={{ marginBottom: 12, fontSize: 13.5, color: 'var(--text-2)' }}>
          Set a new password for <b>{resetTarget?.name}</b>.
        </p>
        <input className="form-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Employee"
        size="sm"
        footer={<>
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" loading={busy} onClick={doDelete}>Delete</Button>
        </>}
      >
        <p style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          Are you sure you want to delete <b>{deleteTarget?.name}</b>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
