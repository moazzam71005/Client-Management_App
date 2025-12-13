import { NextResponse } from 'next/server'
import { ClientService } from '@/services/client-service'
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
        const service = new ClientService()
        const client = await service.updateClient(id, user.id, json)
        return NextResponse.json(client)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 400 })
        }
        console.error('Error updating client:', error)
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
        const service = new ClientService()
        await service.deleteClient(id, user.id)
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting client:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
