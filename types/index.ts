export type Database = {
    // We will generate this or define manually. For now, manual/loose.
    public: {
        Tables: {
            clients: {
                Row: Client
                Insert: Omit<Client, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>
            }
        }
    }
}

export interface Client {
    id: string;
    user_id: string;
    name: string;
    email: string;
    phone?: string | null;
    notes?: string | null;
    created_at: string;
    updated_at: string;
}

export * from './template'
