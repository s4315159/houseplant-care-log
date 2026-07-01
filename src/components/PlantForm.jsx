import { useState } from 'react'
import { STATUSES } from '../lib/plants'

// -----------------------------------------------------------------------------
// PlantForm — the "add a plant" form. Collects name/species, room location,
// starting status and optional care notes, then hands the values back to the
// parent via the onAdd callback.
// -----------------------------------------------------------------------------
export default function PlantForm({ onAdd }) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('Healthy')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    // Delegate the actual insert to the parent, which owns the plant list state.
    const { error } = await onAdd({
      name: name.trim(),
      location: location.trim(),
      status,
      notes: notes.trim() || null,
    })

    if (error) {
      setError(error.message)
    } else {
      // Reset the form ready for the next plant.
      setName('')
      setLocation('')
      setStatus('Healthy')
      setNotes('')
    }
    setBusy(false)
  }

  return (
    <section className="card">
      <h2>Add a plant</h2>
      <form onSubmit={handleSubmit} className="plant-form">
        <div className="form-row">
          <label>
            Name / species
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Monstera deliciosa"
            />
          </label>
          <label>
            Room location
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="e.g. Living room"
            />
          </label>
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Care notes <span className="optional">(optional)</span>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Water weekly, keep out of direct sun"
          />
        </label>

        {error && <p className="message error">{error}</p>}

        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Adding…' : '+ Add plant'}
        </button>
      </form>
    </section>
  )
}
