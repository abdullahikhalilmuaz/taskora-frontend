import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PersonalTaskForm from '../components/PersonalTasks/PersonalTaskForm.jsx';
import SuccessPop from '../components/UI/SuccessPop.jsx';

export default function CreatePersonalTask() {
  const nav = useNavigate();
  const [showPop, setShowPop] = useState(false);

  const handleCreated = (task) => {
    setShowPop(true);
    setTimeout(() => nav('/personal-task/' + task._id), 1200);
  };

  return (
    <div className="page">
      <SuccessPop show={showPop} onDone={() => setShowPop(false)} />

      <div className="page-header">
        <div>
          <div className="page-title">New Personal Task</div>
          <div className="page-subtitle">Private task — only you can see it</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 760, padding: 26 }}>
        <PersonalTaskForm onCreated={handleCreated} onCancel={() => nav('/personal-tasks')} />
      </div>
    </div>
  );
}