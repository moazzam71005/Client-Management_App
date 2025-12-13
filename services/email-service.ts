import { createClient } from '@/lib/supabase/server'

export interface SendEmailInput {
    to: string[]
    subject: string
    body: string
}

export class EmailService {
    private async getAuthClient(userId: string) {
        const { google } = await import('googleapis')
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session || session.user.id !== userId) {
            throw new Error('Unauthorized')
        }

        const { provider_token, provider_refresh_token } = session

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
