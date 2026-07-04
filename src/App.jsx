import { useEffect, useMemo, useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import {
  getPlants,
  addPlant,
  updatePlant,
  deletePlant,
} from './lib/plants'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import PlantForm from './components/PlantForm'
import Toolbar from './components/Toolbar'
import PlantTable from './components/PlantTable'

// -----------------------------------------------------------------------------
// App — the root component. It decides whether to show the login screen or the
// main plant log, owns the list of plants, and wires the child components to
// the data-access layer.
// -----------------------------------------------------------------------------
export default function App() {
  const { user, loading: authLoading, signOut } = useAuth()

  // Plant list state.
  const [plants, setPlants] = useState([])
  const [loadingPlants, setLoadingPlants] = useState(false)
  const [loadError, setLoadError] = useState(null)

  // Search / filter / sort state (controlled by the Toolbar).
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('date-desc')

  // Load the user's plants whenever they log in.
  useEffect(() => {
    if (!user) {
      setPlants([])
      return
    }
    let cancelled = false
    ;(async () => {
      setLoadingPlants(true)
      setLoadError(null)
      const { data, error } = await getPlants()
      if (cancelled) return
      if (error) setLoadError(error.message)
      else setPlants(data)
      setLoadingPlants(false)
    })()
    return () => {
      cancelled = true
    }
  }, [user])

  // --- CRUD handlers -------------------------------------------------------

  // Add a plant, then prepend it to local state so the UI updates instantly.
  async function handleAdd(fields) {
    const { data, error } = await addPlant({ userId: user.id, ...fields })
    if (!error && data) setPlants((prev) => [data, ...prev])
    return { error }
  }

  // Update a plant's status. We optimistically update local state after the
  // database confirms the change.
  async function handleUpdateStatus(id, status) {
    const { data, error } = await updatePlant(id, { status })
    if (!error && data) {
      setPlants((prev) => prev.map((p) => (p.id === id ? data : p)))
    }
  }

  // Delete a plant after a confirmation prompt.
  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}" from your log? This cannot be undone.`)) {
      return
    }
    const { error } = await deletePlant(id)
    if (!error) setPlants((prev) => prev.filter((p) => p.id !== id))
  }

  // --- Derived list: apply search, filter and sort -------------------------
  // useMemo avoids recomputing on every unrelated re-render.
  const visiblePlants = useMemo(() => {
    const term = search.trim().toLowerCase()

    let result = plants.filter((p) => {
      // Text search across name and location.
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term)
      // Status filter.
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter
      return matchesSearch && matchesStatus
    })

    // Sorting.
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'date-asc':
          return new Date(a.created_at) - new Date(b.created_at)
        case 'date-desc':
        default:
          return new Date(b.created_at) - new Date(a.created_at)
      }
    })

    return result
  }, [plants, search, statusFilter, sortBy])

  // --- Render --------------------------------------------------------------

  // While the initial auth check runs, show a neutral loading state.
  if (authLoading) {
    return <div className="centered">Loading…</div>
  }

  // Not logged in → show the auth screen.
  if (!user) {
    return <Auth />
  }

  // Logged in → show the plant log.
  return (
    <div className="app">
      <header className="app-header">
        <div className="brand-inline">
          <span className="brand-badge" aria-hidden="true">🪴</span>
          <div>
            <h1>Houseplant Care &amp; Watering Log</h1>
            <p className="brand-tagline">Your personal plant inventory</p>
          </div>
        </div>
        <div className="user-box">
          <span className="avatar" aria-hidden="true">
            {user.email?.[0]?.toUpperCase()}
          </span>
          <span className="user-email">{user.email}</span>
          <button className="btn ghost" onClick={signOut}>
            Log out
          </button>
        </div>
      </header>

      <main className="container">
        <Dashboard plants={plants} />

        <PlantForm onAdd={handleAdd} />

        <section className="card">
          <div className="card-head">
            <h2>My plants</h2>
            <span className="count-pill">{visiblePlants.length} shown</span>
          </div>

          <Toolbar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />

          {loadError && <p className="message error">{loadError}</p>}
          {loadingPlants ? (
            <p className="empty-state">Loading your plants…</p>
          ) : (
            <PlantTable
              plants={visiblePlants}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>Houseplant Care &amp; Watering Log — built with React, Vite &amp; Supabase.</p>
      </footer>
    </div>
  )
}
