import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });

  const [employees, setEmployees] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch employees
      const empResponse = await fetch(
        "https://taskora-backend-yh4o.onrender.com/api/auth/employees",
        {
          headers: { "x-admin-email": user.email },
        },
      );
      const empData = await empResponse.json();

      // Fetch tasks
      const tasksResponse = await fetch(
        "https://taskora-backend-yh4o.onrender.com/api/tasks",
        {
          headers: { "x-user-email": user.email },
        },
      );
      const tasksData = await tasksResponse.json();

      if (empData.success && tasksData.success) {
        const employees = empData.employees;
        const tasks = tasksData.tasks;

        setEmployees(employees);

        // Calculate stats
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
          (t) => t.status === "Completed",
        ).length;
        const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
        const inProgressTasks = tasks.filter(
          (t) => t.status === "In Progress",
        ).length;
        const overdueTasks = tasks.filter(
          (t) => new Date(t.deadline) < new Date() && t.status !== "Completed",
        ).length;

        setStats({
          totalEmployees: employees.length,
          totalTasks,
          completedTasks,
          pendingTasks: pendingTasks + inProgressTasks,
          overdueTasks,
        });

        // Get recent tasks (last 5)
        setRecentTasks(tasks.slice(0, 5));

        // Calculate department stats
        const deptMap = new Map();
        tasks.forEach((task) => {
          const dept = task.department;
          if (!deptMap.has(dept)) {
            deptMap.set(dept, { tasks: 0, completed: 0 });
          }
          const deptData = deptMap.get(dept);
          deptData.tasks++;
          if (task.status === "Completed") {
            deptData.completed++;
          }
        });

        const deptStats = Array.from(deptMap.entries()).map(([dept, data]) => ({
          department: dept,
          tasks: data.tasks,
          completed: data.completed,
        }));

        setDepartmentStats(deptStats);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={fetchAllData} className="btn-retry">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.totalEmployees}</h3>
            <p>Total Employees</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.completedTasks}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.pendingTasks}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.overdueTasks}</h3>
            <p>Overdue</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/register" className="action-btn">
            <i className="fas fa-user-plus"></i>
            <span>Add Employee</span>
          </Link>
          <Link to="/tasks" className="action-btn">
            <i className="fas fa-eye"></i>
            <span>View All Tasks</span>
          </Link>
          <Link to="/reports" className="action-btn">
            <i className="fas fa-chart-bar"></i>
            <span>Generate Report</span>
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-grid">
        {/* Recent Tasks */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>
              <i className="fas fa-history"></i> Recent Tasks
            </h3>
            <Link to="/tasks" className="view-all">
              View All
            </Link>
          </div>
          <div className="task-list">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <Link
                  to={`/task/${task._id}`}
                  key={task._id}
                  className="task-item-link"
                >
                  <div className="task-item">
                    <div className="task-info">
                      <h4>{task.title}</h4>
                      <p>
                        Assigned to: {task.assignedTo?.name || "Unassigned"}
                      </p>
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
              <p className="no-tasks">No tasks found</p>
            )}
          </div>
        </div>

        {/* Employees List */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>
              <i className="fas fa-users"></i> Employees
            </h3>
            <Link to="/register" className="view-all">
              Add New
            </Link>
          </div>

          <div className="employee-list">
            {employees.length > 0 ? (
              employees.slice(0, 5).map((emp) => (
                <div key={emp._id} className="employee-item">
                  <div className="employee-avatar">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div className="employee-info">
                    <h4>{emp.name}</h4>
                    <p>
                      <span className="employee-dept">{emp.department}</span>
                      <span className="employee-dot">•</span>
                      <span className="employee-designation">
                        {emp.designation || "Staff"}
                      </span>
                    </p>
                    <small className="employee-email">{emp.email}</small>
                  </div>
                  <div className="employee-status">
                    <span
                      className={`status-dot ${emp.isActive ? "active" : "inactive"}`}
                    ></span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No employees found</p>
            )}
          </div>
        </div>
      </div>

      {/* Department Stats */}
      <div className="dashboard-card full-width">
        <div className="card-header">
          <h3>
            <i className="fas fa-building"></i> Department Overview
          </h3>
        </div>
        <div className="department-list">
          {departmentStats.length > 0 ? (
            departmentStats.map((dept, index) => (
              <div key={index} className="department-item">
                <div className="dept-info">
                  <h4>{dept.department}</h4>
                  <p>Total Tasks: {dept.tasks}</p>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(dept.completed / dept.tasks) * 100}%` }}
                  ></div>
                </div>
                <div className="dept-stats">
                  <span>Completed: {dept.completed}</span>
                  <span>
                    {Math.round((dept.completed / dept.tasks) * 100)}%
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No department data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
