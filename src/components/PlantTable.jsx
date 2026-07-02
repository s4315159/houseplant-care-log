import { STATUSES } from '../lib/plants'
import { STATUS_META } from './Dashboard'

// -----------------------------------------------------------------------------
// PlantTable — displays all (filtered) plants in a table with columns for
// name, location, status, date added and notes. The status cell is an inline
// dropdown so the user can update a plant's status in place, and each row has a
// delete button. On narrow screens the table scrolls horizontally.
// -----------------------------------------------------------------------------

// Format an ISO timestamp as a short, readable date (e.g. "4 Jul 2026").
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function PlantTable({ plants, onUpdateStatus, onDelete }) {
  // Friendly empty state when there is nothing to show.
  if (plants.length === 0) {
    return (
      <p className="empty-state">
        No plants to show. Add your first plant above, or adjust your search.
      </p>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="plant-table">
        <thead>
          <tr>
            <th>Name / species</th>
            <th>Location</th>
            <th>Status</th>
            <th>Date added</th>
            <th>Notes</th>
            <th aria-label="Actions"></th>
          </tr>
        </thead>
        <tbody>
          {plants.map((plant) => (
            <tr key={plant.id}>
              <td data-label="Name">{plant.name}</td>
              <td data-label="Location">{plant.location}</td>

              {/* Status: coloured badge + inline dropdown to update it. */}
              <td data-label="Status">
                <span className={`badge ${STATUS_META[plant.status].className}`}>
                  {STATUS_META[plant.status].icon} {plant.status}
                </span>
                <select
                  className="status-select"
                  value={plant.status}
                  onChange={(e) => onUpdateStatus(plant.id, e.target.value)}
                  aria-label={`Update status for ${plant.name}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>

              <td data-label="Date added">{formatDate(plant.created_at)}</td>
              <td data-label="Notes" className="notes-cell">
                {plant.notes || <span className="muted">—</span>}
              </td>

              <td data-label="Actions">
                <button
                  className="btn danger small"
                  onClick={() => onDelete(plant.id, plant.name)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
