import { createContext, useCallback, useContext, useState, useRef } from 'react';
import { playSound } from '../utils/sounds.js';

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

let idc = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [push, setPush] = useState(null);
  const pushTimer = useRef(null);

  const show = useCallback((message, type = 'info', duration = 2600, opts = {}) => {
    const id = ++idc;
    setToasts((t) => [...t, { id, message, type }]);
    if (!opts.silent) {
      if (type === 'success') playSound('success');
      else if (type === 'error') playSound('error');
      else playSound('pop');
    }
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
  }, []);

  const success = useCallback((m, o) => show(m, 'success', 2400, o), [show]);
  const error = useCallback((m, o) => show(m, 'error', 3000, o), [show]);
  const info = useCallback((m, o) => show(m, 'info', 2400, o), [show]);
  const warning = useCallback((m, o) => show(m, 'warning', 2600, o), [show]);

  // Big branded push notification (persists longer, has close button)
  const showPush = useCallback((notif) => {
    setPush(notif);
    playSound('notify');
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => setPush(null), 6000);
  }, []);

  const closePush = useCallback(() => setPush(null), []);

  return (
    <ToastCtx.Provider value={{ show, success, error, info, warning, showPush, closePush }}>
      {children}
      <div className="toast-host">
        {toasts.map((t) => (
          <div key={t.id} className={'toast ' + t.type + ' show'}>
            <i className={
              'toast-icon fas ' +
              (t.type === 'success' ? 'fa-check-circle' :
               t.type === 'error' ? 'fa-exclamation-circle' :
               t.type === 'warning' ? 'fa-triangle-exclamation' : 'fa-info-circle')
            } />
            <span className="toast-msg">{t.message}</span>
          </div>
        ))}
      </div>

      {push && (
        <div className="push-notif" onClick={closePush}>
          <div className="push-icon"><i className="fas fa-bell" /></div>
          <div className="push-body">
            <div className="push-title">{push.title || 'Notification'}</div>
            <div className="push-text">{push.message}</div>
          </div>
          <button className="push-close" onClick={closePush}><i className="fas fa-times" /></button>
        </div>
      )}
    </ToastCtx.Provider>
  );
}
