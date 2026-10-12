import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileQuestion, Info } from 'lucide-react';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingState from '../components/LoadingState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { useToast } from '../components/Toast.jsx';
import { STATUSES, PRIORITIES } from '../data/mockReports.js';
import { getReportById, updateReport } from '../services/mockReportService.js';

export default function UpdateStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();
  const [report, setReport] = useState(undefined);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getReportById(id).then((r) => {
      if (cancelled) return;
      setReport(r);
      if (r) {
        setStatus(r.status);
        setPriority(r.priority);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const dirty = Boolean(report) && (status !== report.status || priority !== report.priority || note.trim() !== '');
  const changedCore = Boolean(report) && (status !== report.status || priority !== report.priority);

  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  if (report === undefined) return <LoadingState label="Loading report" />;
  if (report === null) {
    return (
      <EmptyState
        icon={FileQuestion}
        title="Report not found"
        message="This report does not exist, so it cannot be updated."
        action={<Link to="/reports" className="btn btn-primary">Back to Reports</Link>}
      />
    );
  }

  const validate = () => {
    const next = {};
    if (!STATUSES.includes(status)) next.status = 'Choose a status.';
    if (!PRIORITIES.includes(priority)) next.priority = 'Choose a priority.';
    if (changedCore && note.trim().length < 5) next.note = 'Add an internal note of at least 5 characters explaining this change.';
    if (note.length > 1000) next.note = 'Keep the note under 1,000 characters.';
    return next;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    try {
      await updateReport(report.id, { status, priority, note });
      notify(`${report.reference} updated. Demo changes are temporary.`, 'success');
      navigate(`/reports/${report.id}`);
    } catch {
      notify('The update could not be saved. Try again.', 'error');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (dirty) setConfirmLeave(true);
    else navigate(`/reports/${report.id}`);
  };

  return (
    <div className="stack narrow">
      <Link to={`/reports/${report.id}`} className="btn btn-ghost align-start">
        <ArrowLeft size={18} aria-hidden="true" />
        Back to details
      </Link>

      <form className="card" onSubmit={handleSave} noValidate>
        <div className="card-head">
          <div>
            <p className="muted small">Reference</p>
            <h2 className="mono">{report.reference}</h2>
          </div>
          <div>
            <p className="muted small">Current status</p>
            <StatusBadge status={report.status} />
          </div>
        </div>

        <div className="notice notice-info" role="note">
          <Info size={18} aria-hidden="true" />
          <span>Changes are stored in memory for this demo and are not saved to Firebase. Refreshing the page resets them.</span>
        </div>

        <div className="form-grid">
          <div className={`field ${errors.status ? 'has-error' : ''}`}>
            <label htmlFor="status">Status</label>
            <select id="status" className="input" value={status} onChange={(e) => setStatus(e.target.value)} aria-invalid={Boolean(errors.status)}>
              {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
            {errors.status && <p className="field-error">{errors.status}</p>}
          </div>
          <div className={`field ${errors.priority ? 'has-error' : ''}`}>
            <label htmlFor="priority">Priority</label>
            <select id="priority" className="input" value={priority} onChange={(e) => setPriority(e.target.value)} aria-invalid={Boolean(errors.priority)}>
              {PRIORITIES.map((p) => (<option key={p} value={p}>{p}</option>))}
            </select>
            {errors.priority && <p className="field-error">{errors.priority}</p>}
          </div>
        </div>

        <div className={`field ${errors.note ? 'has-error' : ''}`}>
          <label htmlFor="note">Internal note (administrator only)</label>
          <textarea
            id="note"
            className="input textarea"
            rows={5}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            aria-invalid={Boolean(errors.note)}
            aria-describedby="note-help"
          />
          <p id="note-help" className="helper">
            Required when the status or priority changes. Citizens never see this note. {note.length}/1000
          </p>
          {errors.note && <p className="field-error">{errors.note}</p>}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? (<><span className="spinner spinner-sm" aria-hidden="true" /> Saving…</>) : 'Save Changes'}
          </button>
        </div>
      </form>

      {confirmLeave && (
        <ConfirmDialog
          title="Discard your changes?"
          message="You have unsaved changes to this report. If you leave now they will be lost."
          confirmLabel="Discard changes"
          danger
          onCancel={() => setConfirmLeave(false)}
          onConfirm={() => navigate(`/reports/${report.id}`)}
        />
      )}
    </div>
  );
}