import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/UI/Button.jsx';
import Avatar from '../components/UI/Avatar.jsx';
import { playSound } from '../utils/sounds.js';

export default function Settings() {
  const { user, login } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [soundOn, setSoundOn] = useState(localStorage.getItem('stm_sound') !== 'off');
  const [form, setForm] = useState({
    name: user?.name || '',
    department: user?.department || '',
    designation: user?.designation || '',
    phone: user?.phone || '',
  });

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    localStorage.setItem('stm_sound', next ? 'on' : 'off');
    if (next) playSound('success');
    toast.success('Sounds ' + (next ? 'enabled' : 'disabled'));
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.put('/api/users/' + user._id, form);
      login({ ...user, ...res.user });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-subtitle">Manage your profile and preferences</div>
        </div>
      </div>

      <div className="card" style={{ padding: 26, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <Avatar user={user} size={64} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.name}</div>
          <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{user?.email}</div>
          <span className="badge" style={{ marginTop: 6, background: 'var(--primary-light)', color: 'var(--primary-dark)' }}>
            {user?.userType?.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="card" style={{ padding: 26, maxWidth: 700, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Profile Information</h3>
        <form onSubmit={save}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input className="form-input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Designation</label>
              <input className="form-input" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" loading={busy} icon="fa-save">Save Changes</Button>
          </div>
        </form>
      </div>

      <div className="card" style={{ padding: 26, maxWidth: 700 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Preferences</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-2)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>Sound effects</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Play a sound for notifications and actions</div>
          </div>
          <button
            onClick={toggleSound}
            style={{
              width: 46, height: 26, borderRadius: 13, border: 'none',
              background: soundOn ? 'var(--primary)' : '#d1d5db',
              position: 'relative', transition: 'background .2s', cursor: 'pointer',
            }}
          >
            <span style={{
              position: 'absolute', top: 3, left: soundOn ? 23 : 3,
              width: 20, height: 20, borderRadius: 10, background: '#fff',
              transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>
      </div>
    </div>
  );
}
