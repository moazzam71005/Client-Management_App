import { createClient } from '@/lib/supabase/server'

const TABLE = 'google_connections'

export interface GoogleConnection {
    id: string
    user_id: string
    access_token: string
    refresh_token: string | null
    expires_at: string | null
    scope: string | null
    created_at: string
    updated_at: string
}

export interface GoogleConnectionInsert {
    user_id: string
    access_token: string
    refresh_token?: string | null
    expires_at?: string | null
    scope?: string | null
}

export interface GoogleConnectionUpdate {
    access_token?: string
    refresh_token?: string | null
    expires_at?: string | null
    scope?: string | null
}

export class GoogleConnectionRepository {
    async getConnection(userId: string): Promise<GoogleConnection | null> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .eq('user_id', userId)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                // No rows returned
                return null
            }
            throw error
        }
        return data as GoogleConnection
    }

    async createConnection(connection: GoogleConnectionInsert): Promise<GoogleConnection> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from(TABLE)
            .insert(connection)
            .select()
            .single()

        if (error) throw error
        return data as GoogleConnection
    }

    async updateConnection(userId: string, updates: GoogleConnectionUpdate): Promise<GoogleConnection> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from(TABLE)
            .update(updates)
            .eq('user_id', userId)
            .select()
            .single()

        if (error) throw error
        return data as GoogleConnection
    }

    async upsertConnection(connection: GoogleConnectionInsert): Promise<GoogleConnection> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from(TABLE)
            .upsert(connection, {
                onConflict: 'user_id',
            })
            .select()
            .single()

        if (error) throw error
        return data as GoogleConnection
    }

    async deleteConnection(userId: string): Promise<void> {
        const supabase = await createClient()
        const { error } = await supabase
            .from(TABLE)
            .delete()
            .eq('user_id', userId)

        if (error) throw error
    }
}

