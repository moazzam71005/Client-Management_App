import { NextResponse } from 'next/server'
import { TemplateService } from '@/services/template-service'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const service = new TemplateService()
        const templates = await service.getTemplates(user.id)
        return NextResponse.json(templates)
    } catch (error) {
        console.error('Error fetching templates:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const json = await request.json()
        const service = new TemplateService()
        const template = await service.createTemplate(user.id, json)
        return NextResponse.json(template)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 400 })
        }
        console.error('Error creating template:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
