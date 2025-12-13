import { NextResponse } from 'next/server'
import { ClientService } from '@/services/client-service'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const service = new ClientService()
        const clients = await service.getClients(user.id)
        return NextResponse.json(clients)
    } catch (error) {
        console.error('Error fetching clients:', error)
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
        const service = new ClientService()
        const client = await service.createClient(user.id, json)
        return NextResponse.json(client)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 400 })
        }
        console.error('Error creating client:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
