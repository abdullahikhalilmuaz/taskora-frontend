import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import TaskFilters from "../components/Tasks/TaskFilters.jsx";
import TaskCard from "../components/Tasks/TaskCard.jsx";
import EmptyState from "../components/UI/EmptyState.jsx";
import { SkCard, SkStats } from "../components/UI/Skeleton.jsx";
import useDebounce from "../hooks/useDebounce.js";

export default function Tasks() {
  const { user } = useAuth();
  const isAdmin = user?.userType === "admin";
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    department: "",
    search: "",
  });
  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    let dead = false;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.status) params.append("status", filters.status);
        if (filters.priority) params.append("priority", filters.priority);
        if (filters.department) params.append("department", filters.department);
        if (debouncedSearch) params.append("search", debouncedSearch);
        const data = await api.get("/api/tasks?" + params.toString());
        if (!dead) setTasks(data.tasks || []);
      } catch {}
      if (!dead) setLoading(false);
    })();
    return () => {
      dead = true;
    };
  }, [filters.status, filters.priority, filters.department, debouncedSearch]);

  const clear = () =>
    setFilters({ status: "", priority: "", department: "", search: "" });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Tasks</div>
          <div className="page-subtitle">
            {isAdmin
              ? "Manage and track all your tasks"
              : "Tasks assigned to you by admin"}
          </div>
        </div>
        <Link
          to={isAdmin ? "/tasks/new" : "/personal-tasks/new"}
          className="btn btn-primary"
        >
          <i className="fas fa-plus" />{" "}
          {isAdmin ? "Create Task" : "New Personal Task"}
        </Link>
      </div>

      <TaskFilters value={filters} onChange={setFilters} onClear={clear} />

      {loading ? (
        <>
          <SkStats count={4} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 16,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkCard key={i} h={180} />
            ))}
          </div>
        </>
      ) : tasks.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="fa-list-check"
            title="No tasks found"
            text={
              isAdmin
                ? "Get started by creating your first task"
                : "No tasks have been assigned to you yet"
            }
            action={
              <Link
                to={isAdmin ? "/tasks/new" : "/personal-tasks/new"}
                className="btn btn-primary"
              >
                <i className="fas fa-plus" />{" "}
                {isAdmin ? "Create Task" : "Create Personal Task"}
              </Link>
            }
          />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          {tasks.map((t) => (
            <TaskCard key={t._id} task={t} />
          ))}
        </div>
      )}
    </div>
  );
}
