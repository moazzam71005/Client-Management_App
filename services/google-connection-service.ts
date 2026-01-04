import { GoogleConnectionRepository } from '@/repos/google-connection-repo'

export class GoogleConnectionService {
    private repo: GoogleConnectionRepository

    constructor() {
        this.repo = new GoogleConnectionRepository()
    }

    async getConnection(userId: string) {
        return this.repo.getConnection(userId)
    }

    async saveConnection(
        userId: string,
        accessToken: string,
        refreshToken: string | null,
        expiresAt: string | null,
        scope?: string
    ) {
        return this.repo.upsertConnection({
            user_id: userId,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: expiresAt,
            scope: scope || null,
        })
    }

    async deleteConnection(userId: string) {
        return this.repo.deleteConnection(userId)
    }

    async refreshTokenIfNeeded(userId: string): Promise<string> {
        const connection = await this.getConnection(userId)
        if (!connection) {
            throw new Error('Google connection not found')
        }

        if (!connection.refresh_token) {
            throw new Error('Refresh token not available')
        }

        // Check if token is expired or will expire soon (within 5 minutes)
        const expiresAt = connection.expires_at ? new Date(connection.expires_at) : null
        const now = new Date()
        const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)

        if (expiresAt && expiresAt > fiveMinutesFromNow) {
            // Token is still valid
            return connection.access_token
        }

        // Token needs refresh
        const { google } = await import('googleapis')
        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        )

        oAuth2Client.setCredentials({
            refresh_token: connection.refresh_token,
        })

        const { credentials } = await oAuth2Client.refreshAccessToken()
        
        if (!credentials.access_token) {
            throw new Error('Failed to refresh access token')
        }

        // Update stored token
        await this.repo.updateConnection(userId, {
            access_token: credentials.access_token,
            refresh_token: credentials.refresh_token || connection.refresh_token,
            expires_at: credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : null,
        })

        return credentials.access_token
    }
}

