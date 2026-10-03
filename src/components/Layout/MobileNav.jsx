import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';

export default function MobileNav() {
  const { user } = useAuth();
  const { notifications } = useSocket();
  const unread = notifications.filter((n) => !n.read).length;

  const items = user?.userType === 'admin'
    ? [
        { to: '/dashboard', label: 'Home', icon: 'fa-house' },
        { to: '/tasks', label: 'Tasks', icon: 'fa-list-check' },
        { to: '/employees', label: 'Team', icon: 'fa-users' },
        { to: '/reports', label: 'Reports', icon: 'fa-chart-pie' },
        { to: '/notifications', label: 'Alerts', icon: 'fa-bell', badge: unread },
      ]
    : [
        { to: '/dashboard', label: 'Home', icon: 'fa-house' },
        { to: '/tasks', label: 'Tasks', icon: 'fa-list-check' },
        { to: '/notifications', label: 'Alerts', icon: 'fa-bell', badge: unread },
        { to: '/settings', label: 'Profile', icon: 'fa-user' },
      ];

  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-inner">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) => 'mobile-nav-item' + (isActive ? ' active' : '')}
          >
            <i className={'fas ' + it.icon} />
            <span>{it.label}</span>
            {it.badge > 0 && <span className="nav-dot">{it.badge > 9 ? '9+' : it.badge}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
