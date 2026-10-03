export default function EmptyState({ icon = 'fa-inbox', title, text, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px' }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: 'var(--primary-light)', color: 'var(--primary)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, marginBottom: 14,
      }}>
        <i className={'fas ' + icon} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{title}</h3>
      {text && <p style={{ color: 'var(--text-2)', fontSize: 13.5, marginBottom: 16 }}>{text}</p>}
      {action}
    </div>
  );
}
