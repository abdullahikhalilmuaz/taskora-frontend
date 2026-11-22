import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";
import { api } from "../utils/api.js";

const SocketContext = createContext(null);

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || undefined; // undefined = same origin (works with the Vite proxy in dev)

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  // Connect / reconnect when user changes
  useEffect(() => {
    if (!user?.email) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      setConnected(false);
      return;
    }

    const s = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });
    socketRef.current = s;
    setSocket(s);

    s.on("connect", () => {
      setConnected(true);
      s.emit("user:join", { email: user.email });
    });
    s.on("disconnect", () => setConnected(false));
    s.on("notification:new", (notif) => {
      setNotifications((prev) => {
        if (prev.some((n) => n._id === notif._id)) return prev;
        return [notif, ...prev];
      });
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    };
  }, [user?.email]);

  // Load persisted notifications on mount
  useEffect(() => {
    if (!user?.email) {
      setNotifications([]);
      return;
    }
    let dead = false;
    (async () => {
      try {
        const data = await api.get("/api/notifications");
        if (!dead) setNotifications(data.notifications || []);
      } catch {
        // silent — user may have no notifications yet
      }
    })();
    return () => {
      dead = true;
    };
  }, [user?.email]);

  const joinTaskRoom = useCallback((taskId) => {
    socketRef.current?.emit("task:join", { taskId });
  }, []);

  const leaveTaskRoom = useCallback((taskId) => {
    socketRef.current?.emit("task:leave", { taskId });
  }, []);

  const sendChat = useCallback(
    (taskId, text) => {
      if (!socketRef.current || !user?.email) return;
      socketRef.current.emit("chat:send", { taskId, email: user.email, text });
    },
    [user?.email],
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        notifications,
        setNotifications,
        joinTaskRoom,
        leaveTaskRoom,
        sendChat,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
}
