import { useEffect, useState } from 'react';
import { playSound } from '../../utils/sounds.js';

export default function SuccessPop({ show, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      playSound('success');
      const t = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [show, onDone]);

  if (!visible) return null;

  return (
    <div className="success-pop">
      <div className="success-pop-inner">
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" stroke="#10b981" strokeWidth="6" opacity="0.2" />
          <path
            d="M30 52 L45 67 L72 38"
            stroke="#10b981"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-path"
          />
        </svg>
      </div>
    </div>
  );
}
