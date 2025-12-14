# ClientStream - Client Management Application

ClientStream is a full-stack web application designed for managing clients, synchronizing with Google Calendar, and sending personalized emails via Gmail. Built with modern web technologies, it offers a seamless experience for professionals to organize their workflow.

## 🚀 Features

- **Google OAuth Authentication**: Secure login and session management via Supabase.
- **Client Management**: Full CRUD operations for managing client details (valid only for the owner).
- **Google Calendar Sync**: View and filter events (Today, Week, Month) directly from the dashboard.
- **Email System**: Send personalized emails to multiple clients using the Gmail API.
- **Email Templates**: Create and use reusable email templates with dynamic placeholders (e.g., `{{client_name}}`).
- **Responsive Design**: "Pimped up" UI with dark mode support and smooth animations.

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
- A **Supabase** project
- A **Google Cloud Console** project with Calendar and Gmail APIs enabled

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
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth (Obtained from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Database Setup

1. Go to your **Supabase Dashboard** -> **SQL Editor**.
2. Run the specific SQL scripts provided in the project to set up the tables and security policies:
   - Run `schema.sql` (Creates `clients` table and policies).
   - Run `schema_templates.sql` (Creates `email_templates` table and policies).

### 3. Google Cloud Setup

1. Create OAuth 2.0 credentials in [Google Cloud Console](https://console.cloud.google.com/).
2. Add `http://localhost:3000` to "Authorized Javascript origins" (if applicable, though usually Supabase handles the redirection).
3. Add the callback URL from your Supabase Auth settings to "Authorized redirect URIs".
4. Enable **Google Calendar API** and **Gmail API**.
5. In Supabase Authentication -> Providers -> Google, enter your Client ID and Secret.

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
