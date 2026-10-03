import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext.jsx';
import { api } from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import { fmtTimeAgo } from '../utils/formatDate.js';

export default function Notifications() {
  const { notifications, setNotifications } = useSocket();
  const toast = useToast();
  const nav = useNavigate();

  const markAll = async () => {
    try {
      await api.put('/api/notifications/mark-all/read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All marked as read');
    } catch (e) {
      toast.error(e.message || 'Failed');
    }
  };

  const clearAll = async () => {
    try {
      await api.del('/api/notifications/clear');
      setNotifications([]);
      toast.success('Notifications cleared');
    } catch (e) {
      toast.error(e.message || 'Failed');
    }
  };

  const open = (n) => {
    setNotifications((prev) => prev.map((x) => x._id === n._id ? { ...x, read: true } : x));
    if (n.taskId) nav('/task/' + n.taskId);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Notifications</div>
          <div className="page-subtitle">Stay updated with the latest activities</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={markAll}><i className="fas fa-check-double" /> Mark all read</button>
          <button className="btn btn-outline btn-sm" onClick={clearAll}><i className="fas fa-trash" /> Clear</button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="card">
          <EmptyState icon="fa-bell" title="No notifications" text="You're all caught up!" />
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {notifications.map((n, i) => (
            <div
              key={n._id}
              onClick={() => open(n)}
              className="anim-fade-up"
              style={{
                display: 'flex', gap: 14, padding: '16px 20px',
                cursor: 'pointer',
                borderBottom: i === notifications.length - 1 ? 'none' : '1px solid var(--border-2)',
                background: n.read ? 'transparent' : 'var(--primary-light)',
                transition: 'background .15s',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12, background: '#fff',
                border: '1px solid var(--border)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <i className={
                  'fas ' + (
                    n.type === 'task_assigned' ? 'fa-circle-plus' :
                    n.type === 'task_updated' ? 'fa-rotate' :
                    n.type === 'comment' ? 'fa-comment' :
                    n.type === 'message' ? 'fa-comments' :
                    n.type === 'overdue' ? 'fa-triangle-exclamation' : 'fa-bell'
                  )
                } />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>{n.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{n.message}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 4 }}>{fmtTimeAgo(n.createdAt)}</div>
              </div>
              {!n.read && <span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--primary)', marginTop: 16 }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
