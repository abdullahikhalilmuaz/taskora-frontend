import TaskCard from './TaskCard.jsx';

export default function TaskList({ tasks }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
      {tasks.map((t) => <TaskCard key={t._id} task={t} />)}
    </div>
  );
}
