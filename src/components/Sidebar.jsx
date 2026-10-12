import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, LogOut, X } from 'lucide-react';
import Logo from './Logo.jsx';

const LINKS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/statistics', label: 'Statistics', icon: BarChart3 },
];

export default function Sidebar({ open, onClose, onLogout }) {
  return (
    <>
      {open && <div className="sidebar-scrim" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-top">
          <Logo light />
          <button type="button" className="icon-btn sidebar-close" aria-label="Close navigation" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <nav className="sidebar-nav">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
            >
              <Icon size={20} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="nav-link logout-link" onClick={onLogout}>
          <LogOut size={20} aria-hidden="true" />
          Log out
        </button>
      </aside>
    </>
  );
}