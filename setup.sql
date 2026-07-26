-- Worktrack Supabase setup (chạy 1 lần trên Supabase dashboard)
-- Sau đó: cp .env.example .env → điền key → node generate-config.mjs
-- Bật Google OAuth: Authentication → Providers → Google
-- Thêm URL app vào Redirect URLs

create table if not exists public.app_data (
  user_id uuid not null,
  key text not null,
  value jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.app_data enable row level security;

create policy "Users can manage own app_data"
on public.app_data
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
