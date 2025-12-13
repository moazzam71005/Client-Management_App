import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { EmailTemplate } from '@/types/template'
import { CreateTemplateInput, UpdateTemplateInput } from '@/services/template-service'

async function fetchTemplates(): Promise<EmailTemplate[]> {
    const res = await fetch('/api/templates')
    if (!res.ok) throw new Error('Failed to fetch templates')
    return res.json()
}

async function createTemplate(data: CreateTemplateInput): Promise<EmailTemplate> {
    const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create template')
    return res.json()
}

async function updateTemplate({ id, data }: { id: string; data: UpdateTemplateInput }): Promise<EmailTemplate> {
    const res = await fetch(`/api/templates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update template')
    return res.json()
}

async function deleteTemplate(id: string): Promise<void> {
    const res = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete template')
}

export function useTemplates() {
    const queryClient = useQueryClient()

    const templatesQuery = useQuery({
        queryKey: ['templates'],
        queryFn: fetchTemplates,
    })

    const createMutation = useMutation({
        mutationFn: createTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] })
        },
    })

    const updateMutation = useMutation({
        mutationFn: updateTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] })
        },
    })

    return {
        templates: templatesQuery.data,
        isLoading: templatesQuery.isLoading,
        isError: templatesQuery.isError,
        createTemplate: createMutation.mutateAsync,
        updateTemplate: updateMutation.mutateAsync,
        deleteTemplate: deleteMutation.mutateAsync,
    }
}
