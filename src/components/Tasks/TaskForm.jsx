import { useEffect, useState } from "react";
import { api } from "../../utils/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { DEPARTMENTS, PRIORITIES } from "../../utils/constants.js";
import Button from "../UI/Button.jsx";

export default function TaskForm({ task, onCreated, onCancel }) {
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user?.userType === "admin";
  const isEdit = !!task;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    assignedTo: task?.assignedTo?._id || (isAdmin ? "" : user?._id || ""),
    priority: task?.priority || "Medium",
    deadline: task?.deadline
      ? new Date(task.deadline).toISOString().slice(0, 10)
      : "",
    department: task?.department || user?.department || "IT",
    tags: (task?.tags || []).join(", "),
  });

  useEffect(() => {
    if (!isAdmin) return; // employees never need the employee list
    (async () => {
      try {
        const data = await api.get("/api/users/employees");
        setEmployees(data.employees || []);
      } catch (e) {
        toast.error("Could not load employees");
      }
    })();
  }, [isAdmin]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        priority: form.priority,
        deadline: form.deadline,
        department: form.department,
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };
      if (isAdmin) payload.assignedTo = form.assignedTo;

      let data;
      if (isEdit) {
        data = await api.put("/api/tasks/" + task._id, payload);
        toast.success("Task updated");
      } else {
        data = await api.post("/api/tasks", payload);
        toast.success("Task created");
      }
      onCreated?.(data.task);
    } catch (err) {
      toast.error(
        err.message ||
          (isEdit ? "Failed to update task" : "Failed to create task"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="form-group">
        <label>Task Title *</label>
        <input
          className="form-input"
          required
          value={form.title}
          onChange={set("title")}
          placeholder="e.g. Website Redesign"
        />
      </div>
      <div className="form-group">
        <label>Description *</label>
        <textarea
          className="form-textarea"
          required
          value={form.description}
          onChange={set("description")}
          placeholder="Describe the task..."
        />
      </div>

      {isAdmin ? (
        <div className="form-row">
          <div className="form-group">
            <label>Assign To *</label>
            <select
              className="form-select"
              required
              value={form.assignedTo}
              onChange={set("assignedTo")}
            >
              <option value="">Select employee</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name} — {e.department}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Department *</label>
            <select
              className="form-select"
              required
              value={form.department}
              onChange={set("department")}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="form-group">
          <div
            style={{
              padding: "10px 14px",
              background: "var(--primary-light)",
              borderRadius: 10,
              fontSize: 13,
              color: "var(--primary-dark)",
            }}
          >
            <i className="fas fa-user" style={{ marginRight: 8 }} />
            This task will be assigned to <strong>{user?.name}</strong> (
            {user?.department})
          </div>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label>Priority</label>
          <select
            className="form-select"
            value={form.priority}
            onChange={set("priority")}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Deadline *</label>
          <input
            type="date"
            className="form-input"
            required
            value={form.deadline}
            onChange={set("deadline")}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Tags (comma separated)</label>
        <input
          className="form-input"
          value={form.tags}
          onChange={set("tags")}
          placeholder="frontend, urgent, design"
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "flex-end",
          marginTop: 8,
        }}
      >
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          loading={loading}
          icon={isEdit ? "fa-save" : "fa-plus"}
        >
          {isEdit ? "Save Changes" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
