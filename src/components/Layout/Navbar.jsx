import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';
import NotificationPanel from '../Notifications/NotificationPanel.jsx';
import { initials } from '../../utils/formatDate.js';

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth();
  const { notifications } = useSocket();
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const nav = useNavigate();
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const close = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <header className="topbar">
      <button className="icon-btn" onClick={onMenu} style={{ display: 'none' }} id="menu-btn">
        <i className="fas fa-bars" />
      </button>
      <style>{'@media (max-width:900px){#menu-btn{display:flex !important}}'}</style>

      <div className="topbar-search">
        <i className="fas fa-magnifying-glass" />
        <input placeholder="Search anything..." onFocus={() => nav('/tasks')} readOnly />
      </div>

      <div className="topbar-actions">
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setShowNotif((s) => !s)}>
            <i className="fas fa-bell" />
            {unread > 0 && <span className="badge-dot">{unread > 9 ? '9+' : unread}</span>}
          </button>
          {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
        </div>

        <div ref={userRef} style={{ position: 'relative' }}>
          <div className="topbar-user" onClick={() => setShowUser((s) => !s)}>
            <div className="avatar">{initials(user?.name)}</div>
            <div className="info">
              <div className="name">{user?.name?.split(' ')[0]}</div>
              <div className="role">{user?.userType}</div>
            </div>
            <i className="fas fa-chevron-down" style={{ fontSize: 11, color: 'var(--text-3)' }} />
          </div>
          {showUser && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => { setShowUser(false); nav('/settings'); }}>
                <i className="fas fa-user" /> Profile
              </div>
              <div className="dropdown-item" onClick={() => { setShowUser(false); nav('/settings'); }}>
                <i className="fas fa-gear" /> Settings
              </div>
              <div className="dropdown-item danger" onClick={logout}>
                <i className="fas fa-arrow-right-from-bracket" /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
