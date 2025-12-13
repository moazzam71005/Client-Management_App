import { google } from 'googleapis'
import { createClient } from '@/lib/supabase/server'

export class CalendarService {
    private async getAuthClient(userId: string) {
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session || session.user.id !== userId) {
            throw new Error('Unauthorized')
        }

        const { provider_token, provider_refresh_token } = session

        if (!provider_token) {
            // This effectively means the user didn't sign in with Google or scopes were missing. 
            // In a real production app, we would handle re-auth or refresh token usage explicitly here if the session is stale but valid.
            // Supabase Auth helpers theoretically handle refreshing the session token, but the *provider* token might need specific handling if not refreshed automatically by Supabase.
            // However, Supabase stores the provider token in the session.
            throw new Error('Google OAuth token missing')
        }

        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        )

        oAuth2Client.setCredentials({
            access_token: provider_token,
            refresh_token: provider_refresh_token,
        })

        return oAuth2Client
    }

    async listEvents(userId: string, timeMin?: string, timeMax?: string) {
        const auth = await this.getAuthClient(userId)
        const calendar = google.calendar({ version: 'v3', auth })

        // Default to 'primary' calendar
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: timeMin || new Date().toISOString(),
            timeMax: timeMax,
            maxResults: 50,
            singleEvents: true,
            orderBy: 'startTime',
        })

        return response.data.items || []
    }
}
