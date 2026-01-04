import { NextResponse } from 'next/server'
import { CalendarService } from '@/services/calendar-service'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const timeMin = searchParams.get('timeMin') || undefined
    const timeMax = searchParams.get('timeMax') || undefined

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const service = new CalendarService()
        const events = await service.listEvents(user.id, timeMin, timeMax)
        return NextResponse.json(events)
    } catch (error: any) {
        console.error('Error fetching calendar events:', error)
        if (error.message?.includes('Google connection not found')) {
            return NextResponse.json(
                { error: 'Google connection not found. Please connect your Google account.' },
                { status: 403 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to fetch calendar events' },
            { status: 500 }
        )
    }
}
