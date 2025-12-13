-- Email Templates Table
create table if not exists email_templates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  subject text not null,
  body text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table email_templates enable row level security;

create policy "Users can view their own templates" on email_templates for select using (auth.uid() = user_id);
create policy "Users can insert their own templates" on email_templates for insert with check (auth.uid() = user_id);
create policy "Users can update their own templates" on email_templates for update using (auth.uid() = user_id);
create policy "Users can delete their own templates" on email_templates for delete using (auth.uid() = user_id);
