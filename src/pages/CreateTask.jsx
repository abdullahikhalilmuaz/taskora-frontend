import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TaskForm from "../components/Tasks/TaskForm.jsx";
import SuccessPop from "../components/UI/SuccessPop.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function CreateTask() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [showPop, setShowPop] = useState(false);
  const isAdmin = user?.userType === "admin";

  const handleCreated = (task) => {
    setShowPop(true);
    setTimeout(() => nav("/task/" + task._id), 1200);
  };

  return (
    <div className="page">
      <SuccessPop show={showPop} onDone={() => setShowPop(false)} />

      <div className="page-header">
        <div>
          <div className="page-title">
            {isAdmin ? "Create New Task" : "New Personal Task"}
          </div>
          <div className="page-subtitle">
            {isAdmin
              ? "Assign a task to an employee"
              : "Create a task for yourself"}
          </div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 760, padding: 26 }}>
        <TaskForm onCreated={handleCreated} onCancel={() => nav("/tasks")} />
      </div>
    </div>
  );
}
