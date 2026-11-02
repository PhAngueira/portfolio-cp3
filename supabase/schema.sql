-- Execute uma vez no SQL Editor de um projeto Supabase novo.
-- Idempotente para poder executar novamente sem apagar mensagens ou destaques.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  payload_hash text not null check (length(payload_hash) = 64),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 20 and 5000),
  responded boolean not null default false,
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed')),
  email_id text,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create table if not exists public.featured_projects (
  repo_id bigint primary key check (repo_id between 1 and 9007199254740991),
  created_at timestamptz not null default now()
);

-- Só guarda um hash do IP, com uma chave privada do servidor, e contagem temporária.
create table if not exists public.contact_rate_limits (
  bucket text primary key check (length(bucket) = 64),
  window_start timestamptz not null default now(),
  request_count integer not null default 1
);

alter table public.contact_messages enable row level security;
alter table public.featured_projects enable row level security;
alter table public.contact_rate_limits enable row level security;

-- Sem policies para anon/authenticated: o navegador não acessa estas tabelas.
-- As funções da Vercel usam a chave privada; as operações de dono validam seu JWT e UUID.
revoke all on public.contact_messages from public, anon, authenticated;
revoke all on public.featured_projects from public, anon, authenticated;
revoke all on public.contact_rate_limits from public, anon, authenticated;
grant all on public.contact_messages to service_role;
grant all on public.featured_projects to service_role;
grant all on public.contact_rate_limits to service_role;

-- UPDATE atômico: o limite funciona mesmo com funções em instâncias diferentes.
create or replace function public.check_contact_rate_limit(p_bucket text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  total integer;
begin
  delete from public.contact_rate_limits
    where window_start < now() - interval '1 day';

  insert into public.contact_rate_limits (bucket, window_start, request_count)
  values (p_bucket, now(), 1)
  on conflict (bucket) do update
    set request_count = case
          when public.contact_rate_limits.window_start < now() - interval '15 minutes'
          then 1 else public.contact_rate_limits.request_count + 1 end,
        window_start = case
          when public.contact_rate_limits.window_start < now() - interval '15 minutes'
          then now() else public.contact_rate_limits.window_start end
  returning request_count into total;

  return total <= 5;
end;
$$;

revoke all on function public.check_contact_rate_limit(text) from public, anon, authenticated;
grant execute on function public.check_contact_rate_limit(text) to service_role;
