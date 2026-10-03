import { useSocket } from '../../context/SocketContext.jsx';

export default function NotificationBell({ onClick }) {
  const { notifications } = useSocket();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <button className="icon-btn" onClick={onClick}>
      <i className="fas fa-bell" />
      {unread > 0 && <span className="badge-dot">{unread > 9 ? '9+' : unread}</span>}
    </button>
  );
}
