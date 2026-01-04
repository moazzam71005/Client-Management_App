import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
        // Initiate OAuth flow
        const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/google/connect`
        const scopes = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.send'
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent`

        return NextResponse.redirect(authUrl)
    }

    // Exchange code for tokens
    try {
        const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/google/connect`
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        })

        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange code for tokens')
        }

        const tokens = await tokenResponse.json()

        // Calculate expiration time
        const expiresAt = tokens.expires_in
            ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
            : null

        // Save tokens to database
        const { GoogleConnectionService } = await import('@/services/google-connection-service')
        const connectionService = new GoogleConnectionService()
        await connectionService.saveConnection(
            user.id,
            tokens.access_token,
            tokens.refresh_token || null,
            expiresAt,
            tokens.scope || null
        )

        // Redirect to dashboard with success message
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?google_connected=true`)
    } catch (error) {
        console.error('Error connecting Google:', error)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?google_error=true`)
    }
}

