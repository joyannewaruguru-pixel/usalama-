import { X } from 'lucide-react';
import SearchBar from './SearchBar.jsx';
import { CATEGORIES, STATUSES } from '../data/mockReports.js';

function Select({ id, label, value, onChange, options }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function FilterBar({ filters, onChange, onClear }) {
  const set = (key) => (value) => onChange({ ...filters, [key]: value });
  const dirty = filters.search || filters.category || filters.status || filters.range !== 'all';

  return (
    <div className="card filter-bar">
      <SearchBar value={filters.search} onChange={set('search')} />
      <Select
        id="filter-category"
        label="Category"
        value={filters.category}
        onChange={set('category')}
        options={[{ value: '', label: 'All categories' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
      />
      <Select
        id="filter-status"
        label="Status"
        value={filters.status}
        onChange={set('status')}
        options={[{ value: '', label: 'All statuses' }, ...STATUSES.map((s) => ({ value: s, label: s }))]}
      />
      <Select
        id="filter-range"
        label="Submitted"
        value={filters.range}
        onChange={set('range')}
        options={[
          { value: 'all', label: 'Any time' },
          { value: '7', label: 'Last 7 days' },
          { value: '30', label: 'Last 30 days' },
          { value: '90', label: 'Last 90 days' },
        ]}
      />
      <Select
        id="filter-sort"
        label="Sort by date"
        value={filters.sort}
        onChange={set('sort')}
        options={[
          { value: 'newest', label: 'Newest first' },
          { value: 'oldest', label: 'Oldest first' },
        ]}
      />
      <button type="button" className="btn btn-ghost clear-btn" onClick={onClear} disabled={!dirty}>
        <X size={16} aria-hidden="true" />
        Clear filters
      </button>
    </div>
  );
}