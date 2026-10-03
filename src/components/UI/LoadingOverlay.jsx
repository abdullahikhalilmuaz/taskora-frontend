export default function LoadingOverlay({ show, label = 'Processing...' }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.65)',
      backdropFilter: 'blur(4px)', zIndex: 6000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12,
    }}>
      <div className="sk" style={{ width: 64, height: 64, borderRadius: '50%' }} />
      <div style={{ color: 'var(--text-2)', fontSize: 13.5, fontWeight: 500 }}>{label}</div>
    </div>
  );
}
