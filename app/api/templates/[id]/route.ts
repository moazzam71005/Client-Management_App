import { NextResponse } from 'next/server'
import { TemplateService } from '@/services/template-service'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const json = await request.json()
        const service = new TemplateService()
        const template = await service.updateTemplate(id, user.id, json)
        return NextResponse.json(template)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 400 })
        }
        console.error('Error updating template:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const service = new TemplateService()
        await service.deleteTemplate(id, user.id)
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting template:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
