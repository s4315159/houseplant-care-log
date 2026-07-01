import { supabase } from '../supabaseClient'

// -----------------------------------------------------------------------------
// Data-access layer for the "plants" table.
//
// Keeping every database call in one module (rather than scattered through the
// UI components) makes the code easier to read, test and change. Each function
// returns the Supabase response so callers can handle { data, error }.
// Row Level Security on the server (see supabase/schema.sql) enforces that a
// user can only ever touch their own rows, so we never have to filter by
// user_id when reading.
// -----------------------------------------------------------------------------

// The three valid health statuses, shared across the UI so the values stay
// consistent with the database CHECK constraint.
export const STATUSES = ['Healthy', 'Needs Watering', 'Dormant']

/** Fetch every plant belonging to the signed-in user, newest first. */
export async function getPlants() {
  return supabase
    .from('plants')
    .select('*')
    .order('created_at', { ascending: false })
}

/** Insert a new plant for the given user. */
export async function addPlant({ userId, name, location, status, notes }) {
  return supabase
    .from('plants')
    .insert([{ user_id: userId, name, location, status, notes }])
    .select()
    .single()
}

/** Update the status (or any provided fields) of a single plant by id. */
export async function updatePlant(id, changes) {
  return supabase.from('plants').update(changes).eq('id', id).select().single()
}

/** Permanently delete a plant by id. */
export async function deletePlant(id) {
  return supabase.from('plants').delete().eq('id', id)
}
