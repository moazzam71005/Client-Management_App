import { GoogleConnectionService } from './google-connection-service'

export class CalendarService {
    private connectionService: GoogleConnectionService

    constructor() {
        this.connectionService = new GoogleConnectionService()
    }

    private async getAuthClient(userId: string) {
        const { google } = await import('googleapis')
        
        // Get or refresh the access token
        const accessToken = await this.connectionService.refreshTokenIfNeeded(userId)
        const connection = await this.connectionService.getConnection(userId)

        if (!connection) {
            throw new Error('Google connection not found. Please connect your Google account.')
        }

        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        )

        oAuth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: connection.refresh_token,
        })

        return oAuth2Client
    }

    async listEvents(userId: string, timeMin?: string, timeMax?: string) {
        const { google } = await import('googleapis')
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

