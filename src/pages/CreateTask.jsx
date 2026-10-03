import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TaskForm from '../components/Tasks/TaskForm.jsx';
import SuccessPop from '../components/UI/SuccessPop.jsx';

export default function CreateTask() {
  const nav = useNavigate();
  const [showPop, setShowPop] = useState(false);

  const handleCreated = (task) => {
    setShowPop(true);
    setTimeout(() => nav('/task/' + task._id), 1200);
  };

  return (
    <div className="page">
      <SuccessPop show={showPop} onDone={() => setShowPop(false)} />

      <div className="page-header">
        <div>
          <div className="page-title">Create New Task</div>
          <div className="page-subtitle">Assign a task to an employee</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 760, padding: 26 }}>
        <TaskForm onCreated={handleCreated} onCancel={() => nav('/tasks')} />
      </div>
    </div>
  );
}
