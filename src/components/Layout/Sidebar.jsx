import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';
import { initials } from '../../utils/formatDate.js';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: 'fa-house' },
  { to: '/tasks', label: 'Tasks', icon: 'fa-list-check' },
  { to: '/notifications', label: 'Notifications', icon: 'fa-bell', badge: true },
  { to: '/reports', label: 'Reports', icon: 'fa-chart-pie', admin: true },
  { to: '/employees', label: 'Employees', icon: 'fa-users', admin: true },
  { to: '/settings', label: 'Settings', icon: 'fa-gear' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { notifications } = useSocket();
  const unread = notifications.filter((n) => !n.read).length;

  const items = nav.filter((n) => !n.admin || user?.userType === 'admin');

  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 99 }} />}
      <aside className={'sidebar' + (open ? ' open' : '')}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-logo"><i className="fas fa-check-double" /></div>
          <span>Smart<b>Task</b></span>
        </div>

        <nav className="sidebar-nav">
          {items.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')}
            >
              <i className={'fas ' + n.icon} />
              <span>{n.label}</span>
              {n.badge && unread > 0 && <span className="notif-dot">{unread}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="avatar">{initials(user?.name)}</div>
          <div className="meta">
            <div className="name">{user?.name}</div>
            <div className="role">{user?.userType}</div>
          </div>
          <button className="logout-btn" onClick={logout} title="Logout">
            <i className="fas fa-arrow-right-from-bracket" />
          </button>
        </div>
      </aside>
    </>
  );
}
