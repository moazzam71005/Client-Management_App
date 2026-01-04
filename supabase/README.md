# Local Supabase Development

This directory contains configuration for running Supabase locally during development.

## Setup

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Start Supabase locally:
   ```bash
   supabase start
   ```

3. The CLI will output your local Supabase credentials. Update your `.env.local` file with:
   - `NEXT_PUBLIC_SUPABASE_URL` - Local Supabase URL (usually `http://localhost:54321`)
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Local publishable key
   - `SUPABASE_SERVICE_ROLE_KEY` - Local service role key (for migrations)

## Running Migrations

To apply database migrations:

```bash
supabase db reset
```

Or apply specific migrations:

```bash
supabase migration up
```

## Creating Migrations

Create a new migration:

```bash
supabase migration new <migration_name>
```

## Useful Commands

- `supabase start` - Start local Supabase
- `supabase stop` - Stop local Supabase
- `supabase status` - Check status
- `supabase db reset` - Reset database and apply all migrations
- `supabase studio` - Open Supabase Studio UI

## Database Schemas

The following SQL files should be run in order:

1. `schema.sql` - Creates clients table
2. `schema_templates.sql` - Creates email_templates table
3. `schema_google_connections.sql` - Creates google_connections table

These can be run via Supabase Studio or using the CLI.

