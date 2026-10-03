import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import MobileNav from './MobileNav.jsx';
import useSwipeBack from '../../hooks/useSwipeBack.js';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const showHint = useSwipeBack();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main">
        <Navbar onMenu={() => setSidebarOpen(true)} />
        <div className="page-body anim-fade">
          <Outlet />
        </div>
      </div>
      <MobileNav />
      <div className={'swipe-back-hint' + (showHint ? ' show' : '')}>
        <i className="fas fa-chevron-left" />
      </div>
    </div>
  );
}
