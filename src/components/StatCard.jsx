export default function StatCard({ label, value, icon: Icon, tone = 'navy' }) {
  return (
    <div className="card stat-card">
      <span className={`stat-icon stat-${tone}`}>
        <Icon size={22} aria-hidden="true" />
      </span>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}