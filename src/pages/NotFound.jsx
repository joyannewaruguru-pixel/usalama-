import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';

export default function NotFound() {
  return (
    <div className="login-page">
      <div className="card login-card">
        <EmptyState
          icon={Compass}
          title="Page not found"
          message="The page you are looking for does not exist or has moved."
          action={<Link to="/dashboard" className="btn btn-primary">Go to Overview</Link>}
        />
      </div>
    </div>
  );
}