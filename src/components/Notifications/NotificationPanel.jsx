import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext.jsx";
import { fmtTimeAgo } from "../../utils/formatDate.js";

const iconFor = (type) =>
  type === "task_assigned"
    ? "fa-circle-plus"
    : type === "task_updated"
      ? "fa-rotate"
      : type === "comment"
        ? "fa-comment"
        : type === "overdue"
          ? "fa-triangle-exclamation"
          : type === "due_soon"
            ? "fa-clock"
            : type === "message"
              ? "fa-comments"
              : "fa-bell";

export default function NotificationPanel({ onClose }) {
  const { notifications, setNotifications } = useSocket();
  const nav = useNavigate();

  const open = (n) => {
    setNotifications((prev) =>
      prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)),
    );
    onClose?.();
    if (n.taskId) nav("/task/" + n.taskId);
    else nav("/notifications");
  };

  const markAll = () =>
    setNotifications((prev) => prev.map((x) => ({ ...x, read: true })));

  return (
    <div className="dropdown-menu" style={{ width: 340, padding: 0 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 14px",
          borderBottom: "1px solid var(--border-2)",
        }}
      >
        <strong style={{ fontSize: 13.5 }}>Notifications</strong>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAll}
            style={{ color: "var(--primary)", fontSize: 12, fontWeight: 600 }}
          >
            Mark all read
          </button>
        )}
      </div>
      <div style={{ maxHeight: 380, overflowY: "auto" }}>
        {notifications.length === 0 && (
          <div
            style={{
              padding: 30,
              textAlign: "center",
              color: "var(--text-3)",
              fontSize: 13,
            }}
          >
            No notifications yet
          </div>
        )}
        {notifications.slice(0, 10).map((n) => (
          <div
            key={n._id}
            onClick={() => open(n)}
            style={{
              display: "flex",
              gap: 10,
              padding: "10px 14px",
              cursor: "pointer",
              borderBottom: "1px solid var(--border-2)",
              background: n.read ? "transparent" : "var(--primary-light)",
              transition: "background .12s",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <i
                className={"fas " + iconFor(n.type)}
                style={{ fontSize: 13 }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{n.title}</div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-2)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {n.message}
              </div>
              <div
                style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}
              >
                {fmtTimeAgo(n.createdAt)}
              </div>
            </div>
            {!n.read && (
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: "var(--primary)",
                  marginTop: 12,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
