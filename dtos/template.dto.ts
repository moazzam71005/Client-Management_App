import { z } from 'zod'

export const templateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    subject: z.string().min(1, 'Subject is required'),
    body: z.string().min(1, 'Body is required'),
})

export type CreateTemplateInput = z.infer<typeof templateSchema>
export type UpdateTemplateInput = Partial<CreateTemplateInput>

