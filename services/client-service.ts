import { ClientRepository } from '@/repos/client-repo'
import { clientSchema, type CreateClientInput, type UpdateClientInput } from '@/dtos/client.dto'

export type { CreateClientInput, UpdateClientInput }

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
