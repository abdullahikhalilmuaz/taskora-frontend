import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/TaskDetails.css";

const TaskDetail = ({ user }) => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          headers: {
            "x-user-email": user.email,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setTask(data.task);
      } else {
        setError(data.message || "Failed to fetch task details");
      }
    } catch (err) {
      console.error("Fetch task error:", err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": user.email,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setTask(data.task);
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert("Error updating status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": user.email,
          },
          body: JSON.stringify({ text: comment }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setComment("");
        // Refresh task to get new comment
        fetchTaskDetails();
      } else {
        alert(data.message || "Failed to add comment");
      }
    } catch (err) {
      console.error("Add comment error:", err);
      alert("Error adding comment");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(" ", "-");
  };

  const getPriorityClass = (priority) => {
    return priority.toLowerCase();
  };

  const canEditStatus = () => {
    if (!task || !user) return false;
    return (
      user.userType === "admin" ||
      task.assignedTo?._id === user.id ||
      task.createdBy?._id === user.id
    );
  };

  if (loading) {
    return (
      <div className="task-detail-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading task details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="task-detail-error">
        <i className="fas fa-exclamation-circle"></i>
        <h3>Error</h3>
        <p>{error || "Task not found"}</p>
        <button onClick={() => navigate("/tasks")} className="btn-back">
          <i className="fas fa-arrow-left"></i> Back to Tasks
        </button>
      </div>
    );
  }

  const isOverdue =
    new Date(task.deadline) < new Date() && task.status !== "Completed";

  return (
    <div className="task-detail-page">
      <div className="task-detail-container">
        {/* Header with back button */}
        <div className="detail-header">
          <button onClick={() => navigate("/tasks")} className="btn-back">
            <i className="fas fa-arrow-left"></i> Back to Tasks
          </button>
          <div className="header-actions">
            {canEditStatus() && (
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="status-select"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            )}
          </div>
        </div>

        {/* Task Details Card */}
        <div className="task-detail-card">
          <div className="task-title-section">
            <h1>{task.title}</h1>
            <div className="task-badges">
              <span
                className={`priority-badge ${getPriorityClass(task.priority)}`}
              >
                {task.priority} Priority
              </span>
              <span className={`status-badge ${getStatusClass(task.status)}`}>
                {task.status}
              </span>
              {isOverdue && (
                <span className="overdue-badge">
                  <i className="fas fa-exclamation-triangle"></i> Overdue
                </span>
              )}
            </div>
          </div>

          <div className="task-meta-grid">
            <div className="meta-item">
              <i className="fas fa-user"></i>
              <div>
                <label>Created By</label>
                <p>{task.createdBy?.name || "Unknown"}</p>
                <small>{task.createdBy?.email}</small>
              </div>
            </div>

            <div className="meta-item">
              <i className="fas fa-user-check"></i>
              <div>
                <label>Assigned To</label>
                <p>{task.assignedTo?.name || "Unassigned"}</p>
                <small>{task.assignedTo?.email}</small>
              </div>
            </div>

            <div className="meta-item">
              <i className="fas fa-calendar"></i>
              <div>
                <label>Deadline</label>
                <p className={isOverdue ? "text-danger" : ""}>
                  {formatDate(task.deadline)}
                  {isOverdue && " (Overdue)"}
                </p>
              </div>
            </div>

            <div className="meta-item">
              <i className="fas fa-building"></i>
              <div>
                <label>Department</label>
                <p>{task.department}</p>
              </div>
            </div>

            {task.completedAt && (
              <div className="meta-item">
                <i className="fas fa-check-circle"></i>
                <div>
                  <label>Completed At</label>
                  <p>{formatDate(task.completedAt)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="task-description-section">
            <h3>
              <i className="fas fa-align-left"></i> Description
            </h3>
            <p>{task.description}</p>
          </div>
        </div>

        {/* Two Column Layout for Comments and History */}
        <div className="task-detail-grid">
          {/* Comments Section */}
          <div className="comments-section">
            <h3>
              <i className="fas fa-comments"></i>
              Comments ({task.comments?.length || 0})
            </h3>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="add-comment-form">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows="3"
                required
              />
              <button type="submit" disabled={submitting || !comment.trim()}>
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Posting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Post Comment
                  </>
                )}
              </button>
            </form>

            {/* Comments List */}
            <div className="comments-list">
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((comment, index) => (
                  <div key={index} className="comment-item">
                    <div className="comment-header">
                      <div className="comment-user">
                        <i className="fas fa-user-circle"></i>
                        <strong>{comment.userName}</strong>
                      </div>
                      <span className="comment-date">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="no-comments">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>

          {/* Activity History Section */}
          <div className="history-section">
            <h3>
              <i className="fas fa-history"></i>
              Activity History
            </h3>
            <div className="history-list">
              {task.history && task.history.length > 0 ? (
                task.history.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="history-icon">
                      {item.action === "created" && (
                        <i className="fas fa-plus-circle"></i>
                      )}
                      {item.action === "status_changed" && (
                        <i className="fas fa-sync-alt"></i>
                      )}
                      {item.action === "commented" && (
                        <i className="fas fa-comment"></i>
                      )}
                      {item.action === "assigned" && (
                        <i className="fas fa-user-plus"></i>
                      )}
                      {item.action === "updated" && (
                        <i className="fas fa-edit"></i>
                      )}
                    </div>
                    <div className="history-content">
                      <p>
                        <strong>{item.userName}</strong>
                        {item.action === "created" && " created this task"}
                        {item.action === "status_changed" && (
                          <>
                            {" "}
                            changed status from{" "}
                            <span className="old-value">
                              {item.oldValue}
                            </span>{" "}
                            to{" "}
                            <span className="new-value">{item.newValue}</span>
                          </>
                        )}
                        {item.action === "commented" && " added a comment"}
                        {item.action === "assigned" &&
                          ` assigned task to ${item.newValue}`}
                        {item.action === "updated" && " updated the task"}
                      </p>
                      <span className="history-date">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-history">No activity history yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
