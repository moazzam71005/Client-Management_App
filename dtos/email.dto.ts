import { z } from 'zod'

export const emailSchema = z.object({
    recipients: z.array(z.string().email()).min(1, 'At least one recipient is required'),
    subject: z.string().min(1, 'Subject is required'),
    body: z.string().min(1, 'Body is required'),
})

export type SendEmailInput = z.infer<typeof emailSchema>

