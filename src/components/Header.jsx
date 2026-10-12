import { Menu, UserCircle } from 'lucide-react';

export default function Header({ title, onMenu }) {
  return (
    <header className="topbar">
      <button type="button" className="icon-btn menu-btn" aria-label="Open navigation" onClick={onMenu}>
        <Menu size={22} aria-hidden="true" />
      </button>
      <h1 className="page-title">{title}</h1>
      <div className="profile">
        <span className="profile-text">
          <strong>Demo Administrator</strong>
          <small>Simulated session</small>
        </span>
        <UserCircle size={36} aria-hidden="true" />
      </div>
    </header>
  );
}