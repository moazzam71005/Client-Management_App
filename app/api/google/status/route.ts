import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleConnectionService } from '@/services/google-connection-service'

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const connectionService = new GoogleConnectionService()
        const connection = await connectionService.getConnection(user.id)
        return NextResponse.json({ connected: !!connection })
    } catch (error) {
        console.error('Error checking Google connection:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

