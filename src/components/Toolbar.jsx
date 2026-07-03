import { STATUSES } from '../lib/plants'

// -----------------------------------------------------------------------------
// Toolbar — the search box, status filter and sort control that sit above the
// plant table. It is a "controlled" component: all values live in the parent
// (App) and are passed down, so the table always reflects the current query.
// -----------------------------------------------------------------------------
export default function Toolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
}) {
  return (
    <div className="toolbar">
      {/* Free-text search across plant name and location. */}
      <input
        type="search"
        className="search-input"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="🔍 Search by name or location…"
        aria-label="Search plants"
      />

      {/* Filter by a single status, or show all. */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        aria-label="Filter by status"
      >
        <option value="All">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Sort order (optional sorting feature). */}
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        aria-label="Sort plants"
      >
        <option value="date-desc">Newest first</option>
        <option value="date-asc">Oldest first</option>
        <option value="name-asc">Name (A–Z)</option>
        <option value="name-desc">Name (Z–A)</option>
      </select>
    </div>
  )
}
