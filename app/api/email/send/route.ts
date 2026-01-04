import { NextResponse } from 'next/server'
import { EmailService, SendEmailInput } from '@/services/email-service'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { emailSchema } from '@/dtos/email.dto'

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
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 400 })
        }
        console.error('Error sending emails:', error)
        if (error.message?.includes('Google connection not found')) {
            return NextResponse.json(
                { error: 'Google connection not found. Please connect your Google account to send emails.' },
                { status: 403 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to send emails' },
            { status: 500 }
        )
    }
}
