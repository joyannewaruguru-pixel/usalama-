export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="empty-state">
      {Icon && (
        <span className="empty-icon">
          <Icon size={28} aria-hidden="true" />
        </span>
      )}
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}