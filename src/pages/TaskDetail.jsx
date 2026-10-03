import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/UI/Avatar.jsx';
import Button from '../components/UI/Button.jsx';
import Modal from '../components/UI/Modal.jsx';
import TaskForm from '../components/Tasks/TaskForm.jsx';
import TaskStatusBadge from '../components/Tasks/TaskStatusBadge.jsx';
import TaskPriorityBadge from '../components/Tasks/TaskPriorityBadge.jsx';
import ChatBox from '../components/Chat/ChatBox.jsx';
import { STATUSES } from '../utils/constants.js';
import { fmtDate, fmtTimeAgo, daysUntil } from '../utils/formatDate.js';
import { Sk, SkText } from '../components/UI/Skeleton.jsx';

export default function TaskDetail() {
  const { taskId } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const load = async () => {
    try {
      const data = await api.get('/api/tasks/' + taskId);
      setTask(data.task);
    } catch (e) {
      toast.error(e.message || 'Task not found');
      nav('/tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [taskId]);

  const changeStatus = async (status) => {
    setShowStatusMenu(false);
    if (status === task.status) return;
    setUpdating(true);
    try {
      const data = await api.put('/api/tasks/' + taskId + '/status', { status });
      setTask(data.task);
      toast.success('Status updated to ' + status);
    } catch (e) {
      toast.error(e.message || 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setPosting(true);
    try {
      await api.post('/api/tasks/' + taskId + '/comments', { text: comment });
      setComment('');
      toast.success('Comment posted');
      load();
    } catch (e) {
      toast.error(e.message || 'Failed');
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Sk w={100} h={32} r={10} className="mb-4" />
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <SkText lines={3} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 24 }}>
            {Array.from({ length: 4 }).map((_, i) => <Sk key={i} h={60} r={10} />)}
          </div>
        </div>
        <div className="grid-2">
          <Sk h={300} r={12} />
          <Sk h={300} r={12} />
        </div>
      </div>
    );
  }
  if (!task) return null;

  const days = daysUntil(task.deadline);
  const overdue = days !== null && days < 0 && task.status !== 'Completed';

  const canEdit = user?.userType === 'admin' || task.assignedTo?._id === user?._id || task.createdBy?._id === user?._id;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, gap: 10, flexWrap: 'wrap' }}>
        <Link to="/tasks" className="btn btn-outline btn-sm"><i className="fas fa-arrow-left" /> Back to Tasks</Link>
        <div style={{ display: 'flex', gap: 8 }}>
          {canEdit && (
            <>
              <Button variant="outline" size="sm" icon="fa-pen" onClick={() => setShowEdit(true)}>Edit</Button>
              <div style={{ position: 'relative' }}>
                <Button
                  size="sm" icon="fa-rotate" loading={updating}
                  onClick={() => setShowStatusMenu((s) => !s)}
                >Change Status</Button>
                {showStatusMenu && (
                  <div className="dropdown-menu anim-scale" style={{ top: 'calc(100% + 6px)' }}>
                    {STATUSES.map((s) => (
                      <div key={s} className="dropdown-item" onClick={() => changeStatus(s)}>
                        <i className="fas fa-circle" style={{ fontSize: 8 }} /> {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 26, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>{task.title}</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <TaskPriorityBadge priority={task.priority} />
            <TaskStatusBadge status={task.status} />
            <span className="badge" style={{ background: '#f1f2f4', color: 'var(--text-2)' }}>{task.department}</span>
            {overdue && <span className="badge high"><i className="fas fa-triangle-exclamation" /> Overdue</span>}
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 }}>Description</h4>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{task.description}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18, padding: '18px 0', borderTop: '1px solid var(--border-2)' }}>
          <Meta label="Assigned To" user={task.assignedTo} extra={task.assignedTo?.department} />
          <Meta label="Created By" user={task.createdBy} extra="Owner" />
          <div>
            <div style={{ fontSize: 11.5, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 600, marginBottom: 6 }}>Deadline</div>
            <div style={{ fontWeight: 600, color: overdue ? 'var(--danger)' : 'var(--text)' }}>{fmtDate(task.deadline)}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{overdue ? 'Past due' : days !== null ? (days === 0 ? 'Due today' : 'Due in ' + days + ' days') : ''}</div>
          </div>
          {task.completedAt && (
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 600, marginBottom: 6 }}>Completed</div>
              <div style={{ fontWeight: 600, color: 'var(--success)' }}>{fmtDate(task.completedAt)}</div>
            </div>
          )}
        </div>

        {task.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingTop: 16, borderTop: '1px solid var(--border-2)' }}>
            {task.tags.map((t) => (
              <span key={t} style={{
                background: 'var(--primary-light)', color: 'var(--primary-dark)',
                padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600,
              }}>#{t}</span>
            ))}
          </div>
        )}
      </div>

      <div className="grid-2">
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h3><i className="fas fa-comments" style={{ color: 'var(--primary)' }} /> Team Chat</h3>
            <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>Real-time</span>
          </div>
          <div style={{ padding: 20, flex: 1 }}>
            <ChatBox taskId={taskId} />
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <h3><i className="fas fa-comment" style={{ color: 'var(--primary)' }} /> Comments ({task.comments?.length || 0})</h3>
            </div>
            <div style={{ padding: 16 }}>
              <form onSubmit={postComment} style={{ marginBottom: 14 }}>
                <textarea
                  className="form-textarea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  required
                  style={{ minHeight: 70, marginBottom: 10 }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" size="sm" loading={posting} icon="fa-paper-plane">Post</Button>
                </div>
              </form>

              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {task.comments?.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: 20, fontSize: 13 }}>No comments yet</div>}
                {task.comments?.map((c, i) => (
                  <div key={i} className="anim-fade-up" style={{ display: 'flex', gap: 10, padding: '12px 0', borderTop: '1px solid var(--border-2)' }}>
                    <Avatar user={{ name: c.userName }} size={32} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: 13 }}>{c.userName}</strong>
                        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{fmtTimeAgo(c.createdAt)}</span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3><i className="fas fa-clock-rotate-left" style={{ color: 'var(--primary)' }} /> Activity Log</h3>
            </div>
            <div style={{ padding: 16, maxHeight: 300, overflowY: 'auto' }}>
              {task.history?.slice().reverse().map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i === 0 ? 'none' : '1px solid var(--border-2)' }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', background: 'var(--primary-light)',
                    color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0,
                  }}>
                    <i className={
                      h.action === 'created' ? 'fas fa-plus' :
                      h.action === 'status_changed' ? 'fas fa-rotate' :
                      h.action === 'commented' ? 'fas fa-comment' :
                      h.action === 'updated' ? 'fas fa-pen' : 'fas fa-circle'
                    } />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5 }}>
                      <strong>{h.userName}</strong>{' '}
                      {h.action === 'created' && 'created this task'}
                      {h.action === 'status_changed' && <span>changed status from <b>{h.oldValue}</b> to <b style={{ color: 'var(--primary)' }}>{h.newValue}</b></span>}
                      {h.action === 'commented' && 'added a comment'}
                      {h.action === 'updated' && 'updated the task'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{fmtTimeAgo(h.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Task">
        <TaskForm
          onCreated={() => { setShowEdit(false); load(); toast.success('Task updated'); }}
          onCancel={() => setShowEdit(false)}
        />
      </Modal>
    </div>
  );
}

function Meta({ label, user, extra }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Avatar user={user} size={32} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{user?.name || 'Unassigned'}</div>
          {extra && <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{extra}</div>}
        </div>
      </div>
    </div>
  );
}
