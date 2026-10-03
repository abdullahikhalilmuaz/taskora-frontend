import { useState } from 'react';
import { playSound } from '../../utils/sounds.js';

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const send = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
    playSound('send');
  };

  return (
    <form onSubmit={send} style={{ display: 'flex', gap: 8, padding: '12px 0 0' }}>
      <input
        className="form-input"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
      />
      <button type="submit" className="btn btn-primary" disabled={disabled || !text.trim()}>
        <i className="fas fa-paper-plane" />
      </button>
    </form>
  );
}
