import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Client } from '@/types'
import { CreateClientInput, UpdateClientInput } from '@/services/client-service'

async function fetchClients(): Promise<Client[]> {
    const res = await fetch('/api/clients')
    if (!res.ok) throw new Error('Failed to fetch clients')
    return res.json()
}

async function createClient(data: CreateClientInput): Promise<Client> {
    const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const error = await res.text()
        throw new Error(error || 'Failed to create client')
    }
    return res.json()
}

async function updateClient({ id, data }: { id: string; data: UpdateClientInput }): Promise<Client> {
    const res = await fetch(`/api/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update client')
    return res.json()
}

async function deleteClient(id: string): Promise<void> {
    const res = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete client')
}

export function useClients() {
    const queryClient = useQueryClient()

    const clientsQuery = useQuery({
        queryKey: ['clients'],
        queryFn: fetchClients,
    })

    const createMutation = useMutation({
        mutationFn: createClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] })
        },
    })

    const updateMutation = useMutation({
        mutationFn: updateClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] })
        },
    })

    return {
        clients: clientsQuery.data,
        isLoading: clientsQuery.isLoading,
        isError: clientsQuery.isError,
        createClient: createMutation.mutateAsync,
        updateClient: updateMutation.mutateAsync,
        deleteClient: deleteMutation.mutateAsync,
    }
}
