-- Google Connections Table
-- Stores Google OAuth tokens separately from authentication
create table if not exists google_connections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  scope text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- Enable RLS
alter table google_connections enable row level security;

-- Create Policies
create policy "Users can view their own Google connections" on google_connections for select using (auth.uid() = user_id);
create policy "Users can insert their own Google connections" on google_connections for insert with check (auth.uid() = user_id);
create policy "Users can update their own Google connections" on google_connections for update using (auth.uid() = user_id);
create policy "Users can delete their own Google connections" on google_connections for delete using (auth.uid() = user_id);

