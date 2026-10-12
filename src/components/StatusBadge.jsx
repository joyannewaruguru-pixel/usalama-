import { Inbox, Clock, SearchCheck, ShieldCheck, Lock } from 'lucide-react';

const CONFIG = {
  Received: { Icon: Inbox, cls: 'status-received' },
  'Under Review': { Icon: Clock, cls: 'status-review' },
  'Under Investigation': { Icon: SearchCheck, cls: 'status-investigation' },
  'Action Taken': { Icon: ShieldCheck, cls: 'status-action' },
  Closed: { Icon: Lock, cls: 'status-closed' },
};

export default function StatusBadge({ status }) {
  const { Icon, cls } = CONFIG[status] || CONFIG.Received;
  return (
    <span className={`badge ${cls}`}>
      <Icon size={14} aria-hidden="true" />
      {status}
    </span>
  );
}