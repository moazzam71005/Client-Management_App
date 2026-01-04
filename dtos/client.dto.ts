import { z } from 'zod'

export const clientSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
})

export type CreateClientInput = z.infer<typeof clientSchema>
export type UpdateClientInput = Partial<CreateClientInput>

