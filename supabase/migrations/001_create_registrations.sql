-- Registrations table for H-SOLO event sign-ups
create table if not exists registrations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  email text,
  company text,
  package text not null,
  interest text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table registrations enable row level security;

-- Allow anonymous inserts (for public form submission)
create policy "Allow public insert"
  on registrations for insert
  to anon
  with check (true);

-- Only allow authenticated users to read
create policy "Allow authenticated read"
  on registrations for select
  to authenticated
  using (true);
