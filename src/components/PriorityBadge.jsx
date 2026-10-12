import { ArrowDown, Minus, ArrowUp, AlertOctagon } from 'lucide-react';

const CONFIG = {
  Low: { Icon: ArrowDown, cls: 'priority-low' },
  Medium: { Icon: Minus, cls: 'priority-medium' },
  High: { Icon: ArrowUp, cls: 'priority-high' },
  Urgent: { Icon: AlertOctagon, cls: 'priority-urgent' },
};

export default function PriorityBadge({ priority }) {
  const { Icon, cls } = CONFIG[priority] || CONFIG.Low;
  return (
    <span className={`badge ${cls}`}>
      <Icon size={14} aria-hidden="true" />
      {priority}
    </span>
  );
}