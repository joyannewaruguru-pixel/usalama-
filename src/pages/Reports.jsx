import { useEffect, useState } from 'react';
import { SearchX, Inbox, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import FilterBar from '../components/FilterBar.jsx';
import ReportsTable from '../components/ReportsTable.jsx';
import LoadingState from '../components/LoadingState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { queryReports } from '../services/mockReportService.js';

const DEFAULTS = { search: '', category: '', status: '', range: 'all', sort: 'newest' };

export default function Reports() {
  const [filters, setFilters] = useState(DEFAULTS);
  const [debounced, setDebounced] = useState(DEFAULTS.search);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(filters.search), 250);
    return () => clearTimeout(t);
  }, [filters.search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    queryReports({ ...filters, search: debounced, page, pageSize })
      .then((r) => {
        if (cancelled) return;
        setResult(r);
        if (r.page !== page) setPage(r.page);
      })
      .catch(() => !cancelled && setError('We could not load reports. Try again in a moment.'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [filters.category, filters.status, filters.range, filters.sort, debounced, page, pageSize]);

  const updateFilters = (next) => {
    setFilters(next);
    setPage(1);
  };

  const clear = () => {
    setFilters(DEFAULTS);
    setDebounced('');
    setPage(1);
  };

  const rangeStart = result && result.total ? (result.page - 1) * pageSize + 1 : 0;
  const rangeEnd = result ? Math.min(result.page * pageSize, result.total) : 0;

  return (
    <div className="stack">
      <FilterBar filters={filters} onChange={updateFilters} onClear={clear} />

      <section className="card" aria-labelledby="reports-heading">
        <div className="card-head">
          <h2 id="reports-heading">All reports</h2>
          {result && <span className="muted small" aria-live="polite">{result.total} found</span>}
        </div>

        {error ? (
          <EmptyState icon={AlertTriangle} title="Reports unavailable" message={error} />
        ) : loading && !result ? (
          <LoadingState label="Loading reports" />
        ) : result && !result.hasAny ? (
          <EmptyState icon={Inbox} title="No reports yet" message="Citizen reports will be listed here once they are submitted." />
        ) : result && result.total === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No reports match these filters"
            message="Try a different search term or clear the filters to see every report."
            action={<button type="button" className="btn btn-secondary" onClick={clear}>Clear filters</button>}
          />
        ) : (
          <div className={loading ? 'is-refreshing' : ''}>
            <ReportsTable reports={result.items} />
            <div className="pager">
              <div className="pager-size">
                <label htmlFor="page-size">Rows per page</label>
                <select
                  id="page-size"
                  className="input input-sm"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {[5, 10, 20].map((n) => (<option key={n} value={n}>{n}</option>))}
                </select>
              </div>
              <span className="muted small">
                {rangeStart}–{rangeEnd} of {result.total}
              </span>
              <div className="pager-buttons">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={result.page <= 1}
                >
                  <ChevronLeft size={16} aria-hidden="true" /> Previous
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPage((p) => Math.min(result.pageCount, p + 1))}
                  disabled={result.page >= result.pageCount}
                >
                  Next <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}