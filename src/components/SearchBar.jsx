import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search by reference or description' }) {
  return (
    <div className="field search-field">
      <label htmlFor="report-search">Search reports</label>
      <div className="input-icon">
        <Search size={18} aria-hidden="true" />
        <input
          id="report-search"
          type="search"
          className="input"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}