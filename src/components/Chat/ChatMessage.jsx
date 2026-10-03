import Avatar from '../UI/Avatar.jsx';
import { fmtTimeAgo } from '../../utils/formatDate.js';

export default function ChatMessage({ msg, mine }) {
  return (
    <div className={'anim-fade-up'} style={{ display: 'flex', gap: 10, flexDirection: mine ? 'row-reverse' : 'row', marginBottom: 12 }}>
      <Avatar user={{ name: msg.senderName }} size={30} bg={mine ? 'var(--primary-dark)' : 'var(--info)'} />
      <div style={{ maxWidth: '72%' }}>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 3, textAlign: mine ? 'right' : 'left' }}>
          {msg.senderName} · {fmtTimeAgo(msg.createdAt)}
        </div>
        <div
          style={{
            padding: '9px 13px',
            borderRadius: 14,
            background: mine ? 'var(--primary)' : '#f1f2f4',
            color: mine ? '#fff' : 'var(--text)',
            fontSize: 13.5,
            lineHeight: 1.4,
            borderTopRightRadius: mine ? 4 : 14,
            borderTopLeftRadius: mine ? 14 : 4,
          }}
        >
          {msg.text}
        </div>
      </div>
    </div>
  );
}
