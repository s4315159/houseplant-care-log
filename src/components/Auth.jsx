import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

// -----------------------------------------------------------------------------
// Auth screen — handles both sign-up and log-in on a single toggleable form.
// Shown whenever there is no logged-in user.
// -----------------------------------------------------------------------------
export default function Auth() {
  const { signIn, signUp } = useAuth()

  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null) // { type, text }
  const [busy, setBusy] = useState(false)

  const isLogin = mode === 'login'

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setMessage(null)

    // Call the matching auth action and surface any error to the user.
    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else if (!isLogin) {
      setMessage({
        type: 'success',
        text: 'Account created! You can now log in. (Check your inbox if email confirmation is enabled.)',
      })
      setMode('login')
    }
    setBusy(false)
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">🪴</span>
          <h1>Houseplant Care &amp; Watering Log</h1>
          <p className="subtitle">Your simple, private plant inventory.</p>
        </div>

        <div className="tabs" role="tablist">
          <button
            role="tab"
            aria-selected={isLogin}
            className={isLogin ? 'tab active' : 'tab'}
            onClick={() => { setMode('login'); setMessage(null) }}
          >
            Log in
          </button>
          <button
            role="tab"
            aria-selected={!isLogin}
            className={!isLogin ? 'tab active' : 'tab'}
            onClick={() => { setMode('signup'); setMessage(null) }}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              placeholder="At least 6 characters"
            />
          </label>

          {message && (
            <p className={`message ${message.type}`}>{message.text}</p>
          )}

          <button type="submit" className="btn primary" disabled={busy}>
            {busy ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
