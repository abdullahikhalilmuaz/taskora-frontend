import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api.js";
import { useToast } from "../context/ToastContext.jsx";
import Button from "../components/UI/Button.jsx";
import Modal from "../components/UI/Modal.jsx";
import PersonalTaskForm from "../components/PersonalTasks/PersonalTaskForm.jsx";
import TaskStatusBadge from "../components/Tasks/TaskStatusBadge.jsx";
import TaskPriorityBadge from "../components/Tasks/TaskPriorityBadge.jsx";
import { STATUSES } from "../utils/constants.js";
import { fmtDate, daysUntil } from "../utils/formatDate.js";
import { Sk, SkText } from "../components/UI/Skeleton.jsx";

export default function PersonalTaskDetail() {
  const { taskId } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const data = await api.get("/api/personal-tasks/" + taskId);
      setTask(data.task);
    } catch (e) {
      toast.error(e.message || "Task not found");
      nav("/personal-tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [taskId]);

  const changeStatus = async (status) => {
    setShowStatusMenu(false);
    if (status === task.status) return;
    setUpdating(true);
    try {
      const data = await api.put("/api/personal-tasks/" + taskId + "/status", {
        status,
      });
      setTask(data.task);
      toast.success("Status updated to " + status);
    } catch (e) {
      toast.error(e.message || "Failed to update");
    } finally {
      setUpdating(false);
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await api.del("/api/personal-tasks/" + taskId);
      toast.success("Task deleted");
      nav("/personal-tasks");
    } catch (e) {
      toast.error(e.message || "Failed to delete");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Sk w={100} h={32} r={10} className="mb-4" />
        <div className="card" style={{ padding: 24 }}>
          <SkText lines={3} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
              marginTop: 24,
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <Sk key={i} h={60} r={10} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (!task) return null;

  const days = daysUntil(task.deadline);
  const overdue = days !== null && days < 0 && task.status !== "Completed";

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Link to="/personal-tasks" className="btn btn-outline btn-sm">
          <i className="fas fa-arrow-left" /> Back to My Tasks
        </Link>
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            variant="outline"
            size="sm"
            icon="fa-pen"
            onClick={() => setShowEdit(true)}
          >
            Edit
          </Button>
          <div style={{ position: "relative" }}>
            <Button
              size="sm"
              icon="fa-rotate"
              loading={updating}
              onClick={() => setShowStatusMenu((s) => !s)}
            >
              Change Status
            </Button>
            {showStatusMenu && (
              <div
                className="dropdown-menu anim-scale"
                style={{ top: "calc(100% + 6px)" }}
              >
                {STATUSES.map((s) => (
                  <div
                    key={s}
                    className="dropdown-item"
                    onClick={() => changeStatus(s)}
                  >
                    <i className="fas fa-circle" style={{ fontSize: 8 }} /> {s}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button
            variant="danger"
            size="sm"
            icon="fa-trash"
            loading={deleting}
            onClick={doDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="card" style={{ padding: 26 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>
            {task.title}
          </h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <TaskPriorityBadge priority={task.priority} />
            <TaskStatusBadge status={task.status} />
            {overdue && (
              <span className="badge high">
                <i className="fas fa-triangle-exclamation" /> Overdue
              </span>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <h4
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-2)",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            Description
          </h4>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: "var(--text)",
              whiteSpace: "pre-wrap",
            }}
          >
            {task.description}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 18,
            padding: "18px 0",
            borderTop: "1px solid var(--border-2)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11.5,
                color: "var(--text-2)",
                textTransform: "uppercase",
                letterSpacing: 0.4,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Deadline
            </div>
            <div
              style={{
                fontWeight: 600,
                color: overdue ? "var(--danger)" : "var(--text)",
              }}
            >
              {fmtDate(task.deadline)}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>
              {days === null
                ? ""
                : days < 0
                  ? "Past due"
                  : days === 0
                    ? "Due today"
                    : "Due in " + days + " days"}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11.5,
                color: "var(--text-2)",
                textTransform: "uppercase",
                letterSpacing: 0.4,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Created
            </div>
            <div style={{ fontWeight: 600 }}>{fmtDate(task.createdAt)}</div>
          </div>
          {task.completedAt && (
            <div>
              <div
                style={{
                  fontSize: 11.5,
                  color: "var(--text-2)",
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                Completed
              </div>
              <div style={{ fontWeight: 600, color: "var(--success)" }}>
                {fmtDate(task.completedAt)}
              </div>
            </div>
          )}
        </div>

        {task.tags?.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              paddingTop: 16,
              borderTop: "1px solid var(--border-2)",
            }}
          >
            {task.tags.map((t) => (
              <span
                key={t}
                style={{
                  background: "var(--primary-light)",
                  color: "var(--primary-dark)",
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: 11.5,
                  fontWeight: 600,
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Personal Task"
      >
        <PersonalTaskForm
          task={task}
          onCreated={() => {
            setShowEdit(false);
            load();
          }}
          onCancel={() => setShowEdit(false)}
        />
      </Modal>
    </div>
  );
}
