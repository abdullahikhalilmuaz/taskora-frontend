import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout/Layout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import EmployeeDashboard from './pages/EmployeeDashboard.jsx';
import Tasks from './pages/Tasks.jsx';
import TaskDetail from './pages/TaskDetail.jsx';
import CreateTask from './pages/CreateTask.jsx';
import Employees from './pages/Employees.jsx';
import Notifications from './pages/Notifications.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';

function Protected({ children, adminOnly }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.userType !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />

      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/dashboard" element={user?.userType === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/new" element={<CreateTask />} />
        <Route path="/task/:taskId" element={<TaskDetail />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/register" element={<Protected adminOnly><Register /></Protected>} />
        <Route path="/employees" element={<Protected adminOnly><Employees /></Protected>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
