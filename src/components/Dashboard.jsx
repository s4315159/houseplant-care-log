import { STATUSES } from '../lib/plants'

// -----------------------------------------------------------------------------
// Dashboard — a small summary of the collection showing the total number of
// plants and how many fall into each health status. (Optional "summary
// dashboard" feature.)
// -----------------------------------------------------------------------------

// Emoji + CSS class for each status, reused by the table for colour indicators.
export const STATUS_META = {
  Healthy: { icon: '🟢', className: 'status-healthy' },
  'Needs Watering': { icon: '💧', className: 'status-needs-watering' },
  Dormant: { icon: '😴', className: 'status-dormant' },
}

export default function Dashboard({ plants }) {
  // Count how many plants are in each status.
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = plants.filter((p) => p.status === s).length
    return acc
  }, {})

  return (
    <section className="dashboard">
      <div className="stat total">
        <span className="stat-number">{plants.length}</span>
        <span className="stat-label">Total plants</span>
      </div>
      {STATUSES.map((s) => (
        <div key={s} className={`stat ${STATUS_META[s].className}`}>
          <span className="stat-number">
            {STATUS_META[s].icon} {counts[s]}
          </span>
          <span className="stat-label">{s}</span>
        </div>
      ))}
    </section>
  )
}
