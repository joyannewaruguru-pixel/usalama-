import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Inbox, SearchCheck, Lock, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '../components/StatCard.jsx';
import ReportsTable from '../components/ReportsTable.jsx';
import LoadingState from '../components/LoadingState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { getDashboardStats } from '../services/mockReportService.js';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await getDashboardStats());
    } catch {
      setError('We could not load the overview. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingState label="Loading overview" />;
  if (error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Overview unavailable"
        message={error}
        action={<button type="button" className="btn btn-primary" onClick={load}><RefreshCw size={16} aria-hidden="true" /> Try again</button>}
      />
    );
  }

  const { totals, trend, recent } = data;

  return (
    <div className="stack">
      <section className="grid-4" aria-label="Report totals">
        <StatCard label="Total Reports" value={totals.total} icon={FileText} tone="navy" />
        <StatCard label="Awaiting Review" value={totals.awaitingReview} icon={Inbox} tone="warning" />
        <StatCard label="Under Investigation" value={totals.underInvestigation} icon={SearchCheck} tone="teal" />
        <StatCard label="Closed Reports" value={totals.closed} icon={Lock} tone="success" />
      </section>

      <section className="card" aria-labelledby="trend-title">
        <div className="card-head">
          <h2 id="trend-title">Reports received per week</h2>
          <span className="muted small">Last 8 weeks</span>
        </div>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#D9E0E8" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 12 }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#64748B', fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="reports" name="Reports" stroke="#087F8C" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card" aria-labelledby="recent-title">
        <div className="card-head">
          <h2 id="recent-title">Recent reports</h2>
          <Link to="/reports" className="btn btn-secondary btn-sm">
            View All Reports
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState icon={Inbox} title="No reports yet" message="New citizen reports will appear here as soon as they are submitted." />
        ) : (
          <ReportsTable reports={recent} compact />
        )}
      </section>
    </div>
  );
}