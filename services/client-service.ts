import { ClientRepository } from '@/repos/client-repo'
import { z } from 'zod'

const clientSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
})

export type CreateClientInput = z.infer<typeof clientSchema>
export type UpdateClientInput = Partial<CreateClientInput>

export class ClientService {
    private repo: ClientRepository

    constructor() {
        this.repo = new ClientRepository()
    }

    async getClients(userId: string) {
        return this.repo.getClients(userId)
    }

    async createClient(userId: string, data: CreateClientInput) {
        const validated = clientSchema.parse(data)
        return this.repo.createClient({
            ...validated,
            user_id: userId,
        })
    }

    async updateClient(clientId: string, userId: string, data: UpdateClientInput) {
        // Partial validation for updates is tricky, but here we just re-use schema.partial()
        const validated = clientSchema.partial().parse(data)
        return this.repo.updateClient(clientId, userId, validated)
    }

    async deleteClient(clientId: string, userId: string) {
        return this.repo.deleteClient(clientId, userId)
    }

    async getClientById(clientId: string, userId: string) {
        return this.repo.getClientById(clientId, userId)
    }
}
