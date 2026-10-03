import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * iOS-style swipe-from-left-edge to go back.
 * Only active on touch devices.
 */
export default function useSwipeBack() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showHint, setShowHint] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const tracking = useRef(false);

  useEffect(() => {
    // Do not enable on landing / login / dashboard root
    const noBack = ['/', '/login', '/dashboard'];
    if (noBack.includes(location.pathname)) return;

    const onStart = (e) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      if (t.clientX <= 32) {
        tracking.current = true;
        startX.current = t.clientX;
        startY.current = t.clientY;
        setShowHint(true);
      }
    };
    const onMove = (e) => {
      if (!tracking.current) return;
      const t = e.touches[0];
      if (Math.abs(t.clientY - startY.current) > 60) {
        tracking.current = false;
        setShowHint(false);
        return;
      }
      if (t.clientX - startX.current > 90) {
        tracking.current = false;
        setShowHint(false);
        if (window.history.length > 1) navigate(-1);
        else navigate('/dashboard');
      }
    };
    const onEnd = () => {
      tracking.current = false;
      setShowHint(false);
    };

    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd, { passive: true });
    document.addEventListener('touchcancel', onEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('touchcancel', onEnd);
    };
  }, [location.pathname, navigate]);

  return showHint;
}
