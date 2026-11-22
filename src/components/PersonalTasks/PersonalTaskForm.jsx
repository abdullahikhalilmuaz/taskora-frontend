import { useState } from 'react';
import { api } from '../../utils/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { PRIORITIES } from '../../utils/constants.js';
import Button from '../UI/Button.jsx';

export default function PersonalTaskForm({ task, onCreated, onCancel }) {
  const toast = useToast();
  const isEdit = !!task;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'Medium',
    deadline: task?.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : '',
    tags: (task?.tags || []).join(', '),
  });

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
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      let data;
      if (isEdit) {
        data = await api.put('/api/personal-tasks/' + task._id, payload);
        toast.success('Task updated');
      } else {
        data = await api.post('/api/personal-tasks', payload);
        toast.success('Task created');
      }
      onCreated?.(data.task);
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="form-group">
        <label>Task Title *</label>
        <input className="form-input" required value={form.title} onChange={set('title')} placeholder="e.g. Finish thesis chapter 3" />
      </div>
      <div className="form-group">
        <label>Description *</label>
        <textarea className="form-textarea" required value={form.description} onChange={set('description')} placeholder="What needs to be done?" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Priority</label>
          <select className="form-select" value={form.priority} onChange={set('priority')}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Deadline *</label>
          <input type="date" className="form-input" required value={form.deadline} onChange={set('deadline')} />
        </div>
      </div>
      <div className="form-group">
        <label>Tags (comma separated)</label>
        <input className="form-input" value={form.tags} onChange={set('tags')} placeholder="personal, study, urgent" />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" loading={loading} icon={isEdit ? 'fa-save' : 'fa-plus'}>
          {isEdit ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}