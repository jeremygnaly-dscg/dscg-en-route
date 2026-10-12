-- À coller dans Supabase : SQL Editor → New query → Run.
-- Crée la liste d'attente. Les visiteurs peuvent seulement S'INSCRIRE :
-- personne ne peut lire, modifier ou supprimer les e-mails depuis le site.

create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254),
  ue text not null default 'ue1' check (ue in ('ue1','ue2','ue3','ue4','ue5','toutes')),
  profil text not null default 'alternant' check (profil in ('alternant','initial','libre','autre')),
  source text check (length(source) <= 100),
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

drop policy if exists "inscription publique" on public.waitlist;
create policy "inscription publique" on public.waitlist
  for insert to anon, authenticated
  with check (true);

-- Compteur public (affiche « 128 candidats inscrits ») sans exposer les e-mails
create or replace function public.waitlist_count()
returns bigint
language sql
security definer
set search_path = public
as $$ select count(*) from public.waitlist $$;

grant execute on function public.waitlist_count() to anon, authenticated;
