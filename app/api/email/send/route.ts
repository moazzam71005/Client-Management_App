import { NextResponse } from 'next/server'
import { EmailService, SendEmailInput } from '@/services/email-service'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const emailSchema = z.object({
    recipients: z.array(z.string().email()).min(1, 'At least one recipient is required'),
    subject: z.string().min(1, 'Subject is required'),
    body: z.string().min(1, 'Body is required'),
})

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const json = await request.json()
        const validated = emailSchema.parse(json)

        const service = new EmailService()
        const results = await service.sendEmails(user.id, {
            to: validated.recipients,
            subject: validated.subject,
            body: validated.body
        })

        return NextResponse.json(results)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 400 })
        }
        console.error('Error sending emails:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
