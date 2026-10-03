import { initials } from '../../utils/formatDate.js';

export default function Avatar({ user, size = 36, bg }) {
  const s = { width: size, height: size, fontSize: Math.max(11, size * 0.36) };
  return (
    <div
      style={{
        ...s,
        background: bg || 'var(--primary)',
        color: '#fff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        flexShrink: 0,
        overflow: 'hidden',
      }}
      title={user?.name}
    >
      {user?.avatar ? (
        <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        initials(user?.name)
      )}
    </div>
  );
}
