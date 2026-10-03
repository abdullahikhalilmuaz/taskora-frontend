import { useState } from 'react';
import { api } from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { DEPARTMENTS } from '../utils/constants.js';
import Button from '../components/UI/Button.jsx';
import SuccessPop from '../components/UI/SuccessPop.jsx';

export default function Register() {
  const toast = useToast();
  const [showPop, setShowPop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: 'Welcome123',
    department: 'IT', employeeId: '', designation: 'Staff', phone: '',
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/register', form);
      setShowPop(true);
      toast.success('Employee created successfully');
      setForm({ name: '', email: '', password: 'Welcome123', department: 'IT', employeeId: '', designation: 'Staff', phone: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <SuccessPop show={showPop} onDone={() => setShowPop(false)} />

      <div className="page-header">
        <div>
          <div className="page-title">Add New Employee</div>
          <div className="page-subtitle">Create an account for a new staff member</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 700, padding: 24 }}>
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input className="form-input" required value={form.name} onChange={set('name')} placeholder="e.g. John Doe" />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" className="form-input" required value={form.email} onChange={set('email')} placeholder="john@sumaila.edu" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <select className="form-select" required value={form.department} onChange={set('department')}>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Designation</label>
              <input className="form-input" value={form.designation} onChange={set('designation')} placeholder="e.g. Developer" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Employee ID</label>
              <input className="form-input" value={form.employeeId} onChange={set('employeeId')} placeholder="EMP007 (optional)" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input className="form-input" value={form.phone} onChange={set('phone')} placeholder="+234..." />
            </div>
          </div>

          <div className="form-group">
            <label>Default Password</label>
            <input className="form-input" value={form.password} onChange={set('password')} />
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>
              Employee can change this after first login.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <Button type="submit" loading={loading} icon="fa-user-plus">Create Employee</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
