import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';

function titleFor(pathname) {
  if (pathname.startsWith('/statistics')) return 'Crime Statistics';
  if (pathname.endsWith('/update')) return 'Update Report Status';
  if (pathname.startsWith('/reports/')) return 'Report Details';
  if (pathname.startsWith('/reports')) return 'Reports';
  return 'Overview';
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { notify } = useToast();

  const handleLogout = () => {
    signOut();
    notify('You have been signed out of the demo session.', 'info');
    navigate('/login', { replace: true });
  };

  return (
    <div className="shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <Sidebar open={open} onClose={() => setOpen(false)} onLogout={handleLogout} />
      <div className="shell-main">
        <Header title={titleFor(pathname)} onMenu={() => setOpen(true)} />
        <main id="main" className="content" tabIndex={-1}>
          <div className="demo-banner">
            Demonstration mode: all data is fictional and changes are kept in memory only.
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}