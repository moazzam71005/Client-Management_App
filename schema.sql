-- Clients Table Schema (Please run this in Supabase SQL Editor)

create table if not exists clients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table clients enable row level security;

-- Create Policy
create policy "Users can view their own clients" on clients for select using (auth.uid() = user_id);
create policy "Users can insert their own clients" on clients for insert with check (auth.uid() = user_id);
create policy "Users can update their own clients" on clients for update using (auth.uid() = user_id);
create policy "Users can delete their own clients" on clients for delete using (auth.uid() = user_id);
