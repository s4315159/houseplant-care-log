import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

// -----------------------------------------------------------------------------
// Authentication context
//
// This provider wraps the whole app and exposes the current user session plus
// the sign-up / sign-in / sign-out actions. Any component can read the logged-in
// user with the useAuth() hook instead of talking to Supabase directly.
// -----------------------------------------------------------------------------

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // "loading" prevents a flash of the login screen while we check for an
  // existing session on first page load.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Restore any session that already exists (e.g. after a page refresh).
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // 2. Keep the session in sync when the user logs in or out in this or
    //    another tab. The listener is removed on unmount to avoid leaks.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Create a new account. Supabase sends a confirmation email unless email
  // confirmation is disabled in the project settings.
  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password })

  // Log in with email + password.
  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  // Log out and clear the stored session.
  const signOut = () => supabase.auth.signOut()

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Convenience hook so components can call useAuth() to reach the context.
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider')
  return ctx
}
