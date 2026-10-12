import { useEffect, useState } from 'react';
import { BarChart3, FileText } from 'lucide-react';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import LoadingState from '../components/LoadingState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import StatCard from '../components/StatCard.jsx';
import { getStatistics } from '../services/mockReportService.js';
import { RANGE_OPTIONS, STATUS_COLORS, PRIORITY_COLORS } from '../data/mockStatistics.js';

const AXIS = { fill: '#64748B', fontSize: 12 };

function ChartCard({ title, children, label }) {
  return (
    <section className="card" aria-label={label || title}>
      <div className="card-head"><h2>{title}</h2></div>
      <div className="chart-box">{children}</div>
    </section>
  );
}

export default function Statistics() {
  const [range, setRange] = useState('30');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getStatistics(range).then((d) => {
      if (cancelled) return;
      setData(d);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [range]);

  return (
    <div className="stack">
      <div className="card toolbar-card">
        <div className="field inline-field">
          <label htmlFor="range">Date range</label>
          <select id="range" className="input" value={range} onChange={(e) => setRange(e.target.value)}>
            {RANGE_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
        </div>
        <p className="muted small">Fictional aggregated data. No real citizen information is shown.</p>
      </div>

      {loading && !data ? (
        <LoadingState label="Loading statistics" />
      ) : data.total === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No reports in this date range"
          message="Choose a longer date range to see report trends."
          action={<button type="button" className="btn btn-primary" onClick={() => setRange('all')}>Show all time</button>}
        />
      ) : (
        <div className={`stack ${loading ? 'is-refreshing' : ''}`}>
          <div className="grid-4 single-row">
            <StatCard label="Total reports" value={data.total} icon={FileText} tone="navy" />
          </div>

          <div className="grid-2">
            <ChartCard title="Reports by category">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byCategory} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke="#D9E0E8" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={AXIS} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={120} tick={AXIS} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" name="Reports" fill="#087F8C" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Reports by status">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.byStatus} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="80%" paddingAngle={2} label={({ value }) => value}>
                    {data.byStatus.map((d) => (<Cell key={d.name} fill={STATUS_COLORS[d.name]} />))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Reports over time">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.overTime} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#D9E0E8" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={AXIS} tickLine={false} interval="preserveStartEnd" minTickGap={24} />
                <YAxis allowDecimals={false} tick={AXIS} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="reports" name="Reports received" stroke="#142B4A" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Priority distribution">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byPriority} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#D9E0E8" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={AXIS} tickLine={false} />
                <YAxis allowDecimals={false} tick={AXIS} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" name="Reports" radius={[6, 6, 0, 0]}>
                  {data.byPriority.map((d) => (<Cell key={d.name} fill={PRIORITY_COLORS[d.name]} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}