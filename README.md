# ClientStream - Client Management Application

ClientStream is a full-stack web application designed for managing clients, synchronizing with Google Calendar, and sending personalized emails via Gmail. Built with modern web technologies, it offers a seamless experience for professionals to organize their workflow.

## 🚀 Features

- **Supabase Authentication**: Secure login with email/password or magic link authentication.
- **Google Integration**: Connect your Google account separately to sync calendar and send emails via Gmail.
- **Client Management**: Full CRUD operations for managing client details (valid only for the owner).
- **Google Calendar Sync**: View and filter events (Today, Week, Month) directly from the dashboard.
- **Email System**: Send personalized emails to multiple clients using the Gmail API.
- **Email Templates**: Create and use reusable email templates with dynamic placeholders (e.g., `{{client_name}}`).
- **Responsive Design**: Modern UI with dark mode support and smooth animations.

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod
- **External APIs**: Google Calendar API, Gmail API

## 📋 Prerequisites

Before you begin, ensure you have the following:

- Node.js (v18 or higher)
- npm or yarn
- A **Supabase** project (or Supabase CLI for local development)
- A **Google Cloud Console** project with Calendar and Gmail APIs enabled (for Google integration)

## ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd clientstream
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🔧 Configuration

### 1. Environment Variables

Copy the example environment file and configure your keys:

```bash
cp .env.example .env.local
```

Fill in the `.env.local` file with your credentials:

```env
# Supabase
# Use publishable key (not anon key) - this is the new Supabase standard
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# Google OAuth (For Google Calendar and Gmail integration)
# Obtained from Google Cloud Console
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Local Supabase Development (Recommended)

For local development, you can run Supabase locally:

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Start Supabase locally:
   ```bash
   supabase start
   ```

3. Update your `.env.local` with the local credentials provided by the CLI.

See `supabase/README.md` for more details on local development.

### 2. Database Setup

Run the SQL scripts to set up the database tables and security policies:

**If using Supabase Cloud:**
1. Go to your **Supabase Dashboard** -> **SQL Editor**.
2. Run the following scripts in order:
   - `schema.sql` (Creates `clients` table and policies)
   - `schema_templates.sql` (Creates `email_templates` table and policies)
   - `schema_google_connections.sql` (Creates `google_connections` table and policies)

**If using Local Supabase:**
```bash
supabase db reset
```
Then run the SQL scripts via Supabase Studio or CLI.

### 3. Google Cloud Setup

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the following APIs:
   - **Google Calendar API**
   - **Gmail API**
3. Create OAuth 2.0 credentials (Web application):
   - Add `http://localhost:3000/api/google/connect` to "Authorized redirect URIs"
   - Add your production URL to "Authorized redirect URIs" for production
4. Copy the Client ID and Client Secret to your `.env.local` file.

**Note:** Google connection is separate from authentication. Users authenticate with Supabase Auth, then can optionally connect their Google account for calendar and email features.

## 🏃‍♂️ Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📸 Screenshots

![App Screenshot 1](screenshots/Screenshot%202025-12-14%20130110.png)
![App Screenshot 2](screenshots/Screenshot%202025-12-14%20130124.png)
![App Screenshot 3](screenshots/Screenshot%202025-12-14%20130208.png)
![App Screenshot 4](screenshots/Screenshot%202025-12-14%20130222.png)
![App Screenshot 5](screenshots/Screenshot%202025-12-14%20130239.png)
![App Screenshot 6](screenshots/Screenshot%202025-12-14%20130250.png)

---

## 📄 License

This project is for educational/technical test purposes.
