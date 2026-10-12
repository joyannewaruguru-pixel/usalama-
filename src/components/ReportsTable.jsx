import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import { formatDate, truncate } from '../utils/format.js';

export default function ReportsTable({ reports, compact = false }) {
  return (
    <div className="table-wrap">
      <table className="data-table responsive-table">
        <thead>
          <tr>
            <th scope="col">Reference</th>
            <th scope="col">Category</th>
            {!compact && <th scope="col">Description</th>}
            <th scope="col">Submitted</th>
            <th scope="col">Status</th>
            {!compact && <th scope="col">Priority</th>}
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id}>
              <td data-label="Reference" className="mono">{r.reference}</td>
              <td data-label="Category">{r.category}</td>
              {!compact && <td data-label="Description" className="desc-cell">{truncate(r.description, 70)}</td>}
              <td data-label="Submitted">{formatDate(r.submittedAt)}</td>
              <td data-label="Status"><StatusBadge status={r.status} /></td>
              {!compact && <td data-label="Priority"><PriorityBadge priority={r.priority} /></td>}
              <td data-label="Action">
                <Link className="btn btn-secondary btn-sm" to={`/reports/${r.id}`} aria-label={`View report ${r.reference}`}>
                  <Eye size={16} aria-hidden="true" />
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}