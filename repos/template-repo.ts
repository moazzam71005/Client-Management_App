import { createClient } from '@/lib/supabase/server'
import { EmailTemplate } from '@/types/template'

const TABLE = 'email_templates'

export class TemplateRepository {
    async getTemplates(userId: string) {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as EmailTemplate[]
    }

    async createTemplate(template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from(TABLE)
            .insert(template)
            .select()
            .single()

        if (error) throw error
        return data as EmailTemplate
    }

    async updateTemplate(id: string, userId: string, updates: Partial<Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>>) {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from(TABLE)
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single()

        if (error) throw error
        return data as EmailTemplate
    }

    async deleteTemplate(id: string, userId: string) {
        const supabase = await createClient()
        const { error } = await supabase
            .from(TABLE)
            .delete()
            .eq('id', id)
            .eq('user_id', userId)

        if (error) throw error
        return true
    }
}
