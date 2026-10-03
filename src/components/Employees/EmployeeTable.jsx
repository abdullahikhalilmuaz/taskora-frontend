import EmployeeRow from './EmployeeRow.jsx';

export default function EmployeeTable({ employees, onReset, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Employee ID</th>
            <th>Status</th>
            <th style={{ width: 90 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <EmployeeRow key={e._id} emp={e} onReset={onReset} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
