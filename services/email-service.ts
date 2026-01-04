import { GoogleConnectionService } from './google-connection-service'

export interface SendEmailInput {
    to: string[]
    subject: string
    body: string
}

export class EmailService {
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

    async sendEmails(userId: string, { to, subject, body }: SendEmailInput) {
        const { google } = await import('googleapis')
        const auth = await this.getAuthClient(userId)
        const gmail = google.gmail({ version: 'v1', auth })

        const results = []

        for (const recipient of to) {
            try {
                // Construct basic MIME message
                const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
                const messageParts = [
                    'Content-Type: text/plain; charset=utf-8',
                    'MIME-Version: 1.0',
                    `To: ${recipient}`,
                    `Subject: ${utf8Subject}`,
                    '',
                    body
                ];
                const message = messageParts.join('\n');
                const encodedMessage = Buffer.from(message)
                    .toString('base64')
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=+$/, '');

                await gmail.users.messages.send({
                    userId: 'me',
                    requestBody: {
                        raw: encodedMessage,
                    },
                })
                results.push({ email: recipient, status: 'success' })
            } catch (error: any) {
                console.error(`Failed to send to ${recipient}:`, error)
                results.push({ email: recipient, status: 'error', error: error.message })
            }
        }

        return results
    }
}
