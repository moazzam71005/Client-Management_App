import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleConnectionService } from '@/services/google-connection-service'

export async function POST() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const connectionService = new GoogleConnectionService()
        await connectionService.deleteConnection(user.id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error disconnecting Google:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

