import { createClient } from '@supabase/supabase-js'

// Read the Supabase connection details from environment variables. Vite only
// exposes variables prefixed with "VITE_" to the browser bundle. These are set
// in a local ".env" file during development and in the Vercel dashboard in
// production (see DEPLOYMENT.md).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fail fast with a clear message if the keys are missing, rather than throwing
// an obscure network error later when the first query runs.
if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Missing Supabase environment variables. Copy .env.example to .env and add ' +
      'your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

// A single shared Supabase client is created for the whole app. It handles user
// authentication (JWT session storage/refresh) and all database queries.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
