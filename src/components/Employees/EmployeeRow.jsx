import Avatar from '../UI/Avatar.jsx';
import Badge from '../UI/Badge.jsx';

export default function EmployeeRow({ emp, onReset, onDelete }) {
  return (
    <tr>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar user={emp} size={34} />
          <div>
            <div style={{ fontWeight: 600 }}>{emp.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{emp.email}</div>
          </div>
        </div>
      </td>
      <td>{emp.department}</td>
      <td>{emp.designation || '—'}</td>
      <td style={{ fontFamily: 'monospace', fontSize: 12.5 }}>{emp.employeeId || '—'}</td>
      <td><Badge variant={emp.isActive ? 'active' : 'inactive'}>{emp.isActive ? 'Active' : 'Inactive'}</Badge></td>
      <td>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="icon-btn" title="Reset password" onClick={() => onReset(emp)}><i className="fas fa-key" /></button>
          <button className="icon-btn" title="Delete" onClick={() => onDelete(emp)} style={{ color: 'var(--danger)' }}><i className="fas fa-trash" /></button>
        </div>
      </td>
    </tr>
  );
}
