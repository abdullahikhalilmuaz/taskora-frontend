import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Tasks.css";

const Tasks = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    department: "",
  });

  // Fetch tasks on component mount and when filters change
  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.priority) queryParams.append("priority", filters.priority);
      if (filters.department)
        queryParams.append("department", filters.department);

      const response = await fetch(
        `https://taskora-backend-yh4o.onrender.com/api/tasks?${queryParams}`,
        {
          headers: {
            "x-user-email": user.email,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setTasks(data.tasks);
      } else {
        setError(data.message || "Failed to fetch tasks");
      }
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      priority: "",
      department: "",
    });
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(" ", "-");
  };

  const getPriorityClass = (priority) => {
    return priority.toLowerCase();
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>Tasks</h1>
          <p>Manage and track all your tasks</p>
        </div>
        <Link to="/create-task" className="btn-create">
          <i className="fas fa-plus"></i> Create Task
        </Link>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority</label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              placeholder="Filter by department"
            />
          </div>

          <div className="filter-actions">
            <button onClick={clearFilters} className="btn-clear">
              <i className="fas fa-times"></i> Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="tasks-list-container">
        {loading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i> Loading tasks...
          </div>
        ) : error ? (
          <div className="error-state">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-tasks"></i>
            <h3>No tasks found</h3>
            <p>Get started by creating your first task</p>
            <Link to="/create-task" className="btn-create">
              <i className="fas fa-plus"></i> Create Task
            </Link>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <Link
                to={`/task/${task._id}`}
                key={task._id}
                className="task-card-link"
              >
                <div className="task-card">
                  <div className="task-card-header">
                    <h3>{task.title}</h3>
                    <span
                      className={`priority-badge ${getPriorityClass(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <p className="task-description">{task.description}</p>

                  <div className="task-meta">
                    <div className="meta-item">
                      <i className="fas fa-user"></i>
                      <span>
                        Assigned to: {task.assignedTo?.name || "Unassigned"}
                      </span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-calendar"></i>
                      <span>Deadline: {formatDate(task.deadline)}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-building"></i>
                      <span>{task.department}</span>
                    </div>
                  </div>

                  <div className="task-card-footer">
                    <span
                      className={`status-badge ${getStatusClass(task.status)}`}
                    >
                      {task.status}
                    </span>
                    <div className="task-stats">
                      <span title="Comments">
                        <i className="fas fa-comment"></i>{" "}
                        {task.comments?.length || 0}
                      </span>
                      <span title="Activities">
                        <i className="fas fa-history"></i>{" "}
                        {task.history?.length || 0}
                      </span>
                    </div>
                  </div>

                  {task.deadline &&
                    new Date(task.deadline) < new Date() &&
                    task.status !== "Completed" && (
                      <div className="overdue-badge">
                        <i className="fas fa-exclamation-triangle"></i> Overdue
                      </div>
                    )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
