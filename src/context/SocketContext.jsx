import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const SocketCtx = createContext(null);
export const useSocket = () => useContext(SocketCtx);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const { showPush } = useToast();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const s = io('/', { transports: ['websocket', 'polling'] });
    socketRef.current = s;

    s.on('connect', () => {
      setConnected(true);
      s.emit('user:join', { email: user.email });
    });

    s.on('disconnect', () => setConnected(false));

    s.on('notification:new', (n) => {
      setNotifications((prev) => [n, ...prev]);
      showPush({ title: n.title, message: n.message });
    });

    return () => { s.disconnect(); socketRef.current = null; };
  }, [user, showPush]);

  const joinTaskRoom = (taskId) => socketRef.current?.emit('task:join', { taskId });
  const leaveTaskRoom = (taskId) => socketRef.current?.emit('task:leave', { taskId });
  const sendChat = (taskId, text) => socketRef.current?.emit('chat:send', { taskId, email: user?.email, text });

  return (
    <SocketCtx.Provider value={{
      socket: socketRef.current,
      connected,
      notifications,
      setNotifications,
      joinTaskRoom,
      leaveTaskRoom,
      sendChat,
    }}>
      {children}
    </SocketCtx.Provider>
  );
}
