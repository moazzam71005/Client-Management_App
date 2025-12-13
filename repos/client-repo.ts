import { createClient } from '@/lib/supabase/server'
import { Client, Database } from '@/types'

// We will use the 'clients' table
const TABLE = 'clients'

export class ClientRepository {
    async getClients(userId: string) {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as Client[]
    }

    async createClient(client: Database['public']['Tables']['clients']['Insert']) {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from(TABLE)
            .insert(client)
            .select()
            .single()

        if (error) throw error
        return data as Client
    }

    async updateClient(id: string, userId: string, updates: Database['public']['Tables']['clients']['Update']) {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from(TABLE)
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId) // Security: Ensure user owns the client
            .select()
            .single()

        if (error) throw error
        return data as Client
    }

    async deleteClient(id: string, userId: string) {
        const supabase = await createClient()
        const { error } = await supabase
            .from(TABLE)
            .delete()
            .eq('id', id)
            .eq('user_id', userId)

        if (error) throw error
        return true
    }

    async getClientById(id: string, userId: string) {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single()

        if (error) throw error
        return data as Client
    }
}
