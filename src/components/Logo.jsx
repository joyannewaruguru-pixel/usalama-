import { ShieldCheck } from 'lucide-react';

export default function Logo({ light = false }) {
  return (
    <div className={`logo ${light ? 'logo-light' : ''}`}>
      <span className="logo-mark">
        <ShieldCheck size={22} aria-hidden="true" />
      </span>
      <span className="logo-text">
        <strong>Usalama</strong>
        <small>Admin Console</small>
      </span>
    </div>
  );
}