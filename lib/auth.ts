import { createClient } from '@/lib/supabase/server'

/**
 * Check if user is authenticated (returns user or null)
 * This is a utility function that can be used in server components and API routes
 */
export async function getAuthenticatedUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

