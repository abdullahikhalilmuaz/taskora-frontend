import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

const EmployeeDashboard = ({ user }) => {
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });

  useEffect(() => {
    fetchMyTasks();
    loadNotifications();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://taskora-backend-yh4o.onrender.com/api/tasks/my-tasks",
        {
          headers: {
            "x-user-email": user.email,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setMyTasks(data.tasks);

        // Calculate stats
        const totalAssigned = data.tasks.length;
        const inProgress = data.tasks.filter(
          (t) => t.status === "In Progress",
        ).length;
        const completed = data.tasks.filter(
          (t) => t.status === "Completed",
        ).length;
        const overdue = data.tasks.filter(
          (t) => new Date(t.deadline) < new Date() && t.status !== "Completed",
        ).length;

        setStats({
          assigned: totalAssigned,
          inProgress,
          completed,
          overdue,
        });

        // Generate notifications from tasks
        generateNotifications(data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = (tasks) => {
    const newNotifications = [];
    const userId = user?._id || user?.id;

    tasks.forEach((task) => {
      // Check for overdue tasks
      if (new Date(task.deadline) < new Date() && task.status !== "Completed") {
        newNotifications.push({
          id: `overdue-${task._id}-${Date.now()}`,
          taskId: task._id,
          taskTitle: task.title,
          message: `Task "${task.title}" is overdue`,
          time: new Date().toISOString(),
          read: false,
          type: "danger",
        });
      }

      // Check for tasks due in 2 days
      const daysLeft = Math.ceil(
        (new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24),
      );
      if (daysLeft <= 2 && daysLeft > 0 && task.status !== "Completed") {
        newNotifications.push({
          id: `due-${task._id}-${Date.now()}`,
          taskId: task._id,
          taskTitle: task.title,
          message: `Task "${task.title}" is due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`,
          time: new Date().toISOString(),
          read: false,
          type: "warning",
        });
      }

      // Check for new comments
      if (task.comments && task.comments.length > 0) {
        const lastComment = task.comments[task.comments.length - 1];
        // Check if this comment is from someone else (not the current user)
        if (lastComment.userId && lastComment.userId.toString() !== userId) {
          newNotifications.push({
            id: `comment-${task._id}-${lastComment._id || Date.now()}`,
            taskId: task._id,
            taskTitle: task.title,
            message: `New comment on "${task.title}" by ${lastComment.userName || "Someone"}`,
            time: lastComment.createdAt || new Date().toISOString(),
            read: false,
            type: "info",
          });
        }
      }
    });

    // Remove duplicates based on taskId and type
    const unique = newNotifications.filter(
      (notif, index, self) =>
        index ===
        self.findIndex(
          (n) => n.taskId === notif.taskId && n.type === notif.type,
        ),
    );

    // Sort by time (newest first) and limit to 10
    const sorted = unique
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);

    // Merge with existing unread notifications
    const existingUnread = notifications.filter((n) => !n.read);
    const merged = [...existingUnread, ...sorted];

    // Remove duplicates
    const finalNotifications = merged.filter(
      (notif, index, self) =>
        index === self.findIndex((n) => n.id === notif.id),
    );

    setNotifications(finalNotifications);
    saveNotifications(finalNotifications);
  };

  const loadNotifications = () => {
    const userId = user._id || user.id; // Handle both id and _id
    if (!userId) return;

    const saved = localStorage.getItem(`notifications_${userId}`);
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  };

  const saveNotifications = (updated) => {
    const userId = user._id || user.id;
    if (userId) {
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(updated));
    }
  };

  const markAsRead = (notificationId) => {
    const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n,
    );
    setNotifications(updated);
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const clearNotifications = () => {
    setNotifications([]);
    const userId = user._id || user.id;
    if (userId) {
      localStorage.removeItem(`notifications_${userId}`);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUpcomingDeadlines = () => {
    return myTasks
      .filter((task) => task.status !== "Completed")
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 3);
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>My Dashboard</h1>
          <p>
            Welcome back, {user?.name} | {user?.department}
          </p>
        </div>

        {/* Notification Bell */}
        <div className="notification-bell-container">
          <button
            className="notification-bell"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notifications</h3>
                <div className="notification-actions">
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="mark-read-btn">
                      Mark all as read
                    </button>
                  )}
                  <button onClick={clearNotifications} className="clear-btn">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${!notification.read ? "unread" : ""} ${notification.type}`}
                      onClick={() => {
                        markAsRead(notification.id);
                        // Navigate to task if needed
                        if (notification.taskId) {
                          window.location.href = `/task/${notification.taskId}`;
                        }
                      }}
                    >
                      <div className="notification-icon">
                        {notification.type === "danger" && (
                          <i className="fas fa-exclamation-circle"></i>
                        )}
                        {notification.type === "warning" && (
                          <i className="fas fa-clock"></i>
                        )}
                        {notification.type === "info" && (
                          <i className="fas fa-comment"></i>
                        )}
                      </div>
                      <div className="notification-content">
                        <p>{notification.message}</p>
                        <span className="notification-time">
                          {formatTimeAgo(notification.time)}
                        </span>
                      </div>
                      {!notification.read && (
                        <span className="unread-dot"></span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="no-notifications">No notifications</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.assigned}</h3>
            <p>Assigned Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <i className="fas fa-spinner"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.overdue}</h3>
            <p>Overdue</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/create-task" className="action-btn">
            <i className="fas fa-plus-circle"></i>
            <span>Create Task</span>
          </Link>
          <Link to="/tasks" className="action-btn">
            <i className="fas fa-list"></i>
            <span>All Tasks</span>
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-grid">
        {/* My Tasks */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>
              <i className="fas fa-clipboard-list"></i> My Tasks
            </h3>
            <Link to="/tasks" className="view-all">
              View All
            </Link>
          </div>
          <div className="task-list">
            {myTasks.length > 0 ? (
              myTasks.slice(0, 5).map((task) => (
                <Link
                  to={`/task/${task._id}`}
                  key={task._id}
                  className="task-item-link"
                >
                  <div className="task-item">
                    <div className="task-info">
                      <h4>{task.title}</h4>
                      <p>Created by: {task.createdBy?.name || "Unknown"}</p>
                    </div>
                    <div className="task-meta">
                      <span
                        className={`status-badge ${task.status.toLowerCase().replace(" ", "-")}`}
                      >
                        {task.status}
                      </span>
                      <span
                        className={`priority-badge ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                      <span className="deadline">
                        <i className="far fa-calendar"></i>{" "}
                        {formatDate(task.deadline)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="no-tasks">No tasks assigned yet</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>
              <i className="fas fa-history"></i> Recent Activity
            </h3>
          </div>
          <div className="recent-activity-list">
            {myTasks.length > 0 ? (
              myTasks.slice(0, 5).map((task) => {
                const lastActivity = task.history?.[task.history.length - 1];
                return (
                  <div key={task._id} className="activity-item">
                    <div className="activity-icon">
                      {lastActivity?.action === "created" && (
                        <i className="fas fa-plus-circle"></i>
                      )}
                      {lastActivity?.action === "status_changed" && (
                        <i className="fas fa-sync-alt"></i>
                      )}
                      {lastActivity?.action === "commented" && (
                        <i className="fas fa-comment"></i>
                      )}
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>{task.title}</strong>
                        {lastActivity ? ` - ${lastActivity.action}` : ""}
                      </p>
                      <span className="activity-time">
                        {lastActivity
                          ? formatTimeAgo(lastActivity.timestamp)
                          : "No activity"}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-activity">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="dashboard-card full-width">
        <div className="card-header">
          <h3>
            <i className="fas fa-clock"></i> Upcoming Deadlines
          </h3>
        </div>
        <div className="deadlines-grid">
          {getUpcomingDeadlines().length > 0 ? (
            getUpcomingDeadlines().map((task) => {
              const daysLeft = getDaysUntilDeadline(task.deadline);
              const deadlineClass =
                daysLeft <= 2 ? "urgent" : daysLeft <= 5 ? "warning" : "normal";

              return (
                <Link
                  to={`/task/${task._id}`}
                  key={task._id}
                  className={`deadline-item ${deadlineClass}`}
                >
                  <i
                    className={`fas fa-${deadlineClass === "urgent" ? "exclamation-circle" : "clock"}`}
                  ></i>
                  <div>
                    <h4>{task.title}</h4>
                    <p>
                      {daysLeft <= 0
                        ? "Overdue"
                        : `Due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}
                      ({formatDate(task.deadline)})
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="no-deadlines">No upcoming deadlines</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
