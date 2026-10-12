import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Video, Mic, MapPin, Eye, Pencil, Lock, FileQuestion, Paperclip } from 'lucide-react';
import StatusBadge from '../components/StatusBadge.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import LoadingState from '../components/LoadingState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import { getReportById } from '../services/mockReportService.js';
import { formatDateTime } from '../utils/format.js';

const EVIDENCE_ICONS = { photo: Camera, video: Video, audio: Mic };

function EvidenceTile({ item }) {
  const Icon = EVIDENCE_ICONS[item.type] || Paperclip;
  return (
    <li className="evidence-tile">
      <span className="evidence-thumb">
        <Icon size={26} aria-hidden="true" />
      </span>
      <span className="evidence-name">{item.name}</span>
      <span className="muted small">{item.type} · {item.size}</span>
      <span className="chip">Sample placeholder</span>
    </li>
  );
}

export default function ReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(undefined);
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReport(undefined);
    getReportById(id).then((r) => !cancelled && setReport(r));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (report === undefined) return <LoadingState label="Loading report" />;
  if (report === null) {
    return (
      <EmptyState
        icon={FileQuestion}
        title="Report not found"
        message="This report does not exist or the link is incorrect. Go back to the list to pick another report."
        action={<Link to="/reports" className="btn btn-primary">Back to Reports</Link>}
      />
    );
  }

  return (
    <div className="stack">
      <div className="toolbar">
        <Link to="/reports" className="btn btn-ghost">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to Reports
        </Link>
        <div className="toolbar-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setEvidenceOpen(true)} disabled={report.evidence.length === 0}>
            <Eye size={18} aria-hidden="true" />
            View Evidence
          </button>
          <Link to={`/reports/${report.id}/update`} className="btn btn-primary">
            <Pencil size={18} aria-hidden="true" />
            Update Status
          </Link>
        </div>
      </div>

      <div className="detail-grid">
        <div className="stack">
          <section className="card" aria-labelledby="summary-title">
            <div className="card-head">
              <div>
                <p className="muted small">Reference</p>
                <h2 id="summary-title" className="mono">{report.reference}</h2>
              </div>
              <div className="badge-row">
                <StatusBadge status={report.status} />
                <PriorityBadge priority={report.priority} />
              </div>
            </div>
            <h3 className="subhead">Description</h3>
            <p className="prose">{report.description}</p>
            <dl className="meta-grid">
              <div><dt>Category</dt><dd>{report.category}</dd></div>
              <div><dt>Submitted</dt><dd>{formatDateTime(report.submittedAt)}</dd></div>
              <div><dt>Incident date</dt><dd>{formatDateTime(report.incidentDate)}</dd></div>
              <div><dt>Last updated</dt><dd>{formatDateTime(report.updatedAt)}</dd></div>
              <div className="span-2">
                <dt>Location</dt>
                <dd>
                  {report.location ? (<><MapPin size={16} aria-hidden="true" /> {report.location}</>) : 'Not provided by the citizen'}
                </dd>
              </div>
            </dl>
          </section>

          <section className="card" aria-labelledby="evidence-title">
            <div className="card-head">
              <h2 id="evidence-title">Evidence</h2>
              <span className="muted small">{report.evidence.length} item{report.evidence.length === 1 ? '' : 's'}</span>
            </div>
            {report.evidence.length === 0 ? (
              <p className="muted">The citizen did not attach any evidence.</p>
            ) : (
              <>
                <p className="muted small">Previews are sample placeholders. No real uploaded files are retrieved in this demonstration.</p>
                <ul className="evidence-grid">
                  {report.evidence.map((e) => (<EvidenceTile key={e.id} item={e} />))}
                </ul>
              </>
            )}
          </section>
        </div>

        <aside className="card notes-card" aria-labelledby="notes-title">
          <div className="card-head">
            <h2 id="notes-title">Internal notes</h2>
            <span className="chip chip-warning"><Lock size={12} aria-hidden="true" /> Administrator only</span>
          </div>
          <p className="muted small">Mock information. Never shown to citizens tracking this report.</p>
          {report.internalNotes.length === 0 ? (
            <p className="muted">No internal notes yet. Add one when you update the status.</p>
          ) : (
            <ul className="notes-list">
              {report.internalNotes.map((n) => (
                <li key={n.id}>
                  <p>{n.text}</p>
                  <span className="muted small">{n.author} · {formatDateTime(n.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {evidenceOpen && (
        <Modal
          title={`Evidence for ${report.reference}`}
          onClose={() => setEvidenceOpen(false)}
          labelledBy="evidence-modal-title"
          footer={<button type="button" className="btn btn-secondary" onClick={() => setEvidenceOpen(false)}>Close</button>}
        >
          <p className="muted small">Sample placeholders only. A secure viewer will be added when storage is connected.</p>
          <ul className="evidence-grid">
            {report.evidence.map((e) => (<EvidenceTile key={e.id} item={e} />))}
          </ul>
        </Modal>
      )}
    </div>
  );
}