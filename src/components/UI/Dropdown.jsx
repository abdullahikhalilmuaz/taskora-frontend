import { useEffect, useRef, useState } from 'react';

export default function Dropdown({ trigger, children, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <div onClick={() => setOpen((s) => !s)}>{trigger}</div>
      {open && (
        <div className="dropdown-menu" style={{ [align]: 0, left: align === 'left' ? 0 : 'auto' }}>
          {children}
        </div>
      )}
    </div>
  );
}
