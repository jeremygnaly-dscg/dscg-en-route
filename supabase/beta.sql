-- Révizen · bêta : comptes, progression synchronisée, avis des testeurs.
-- À exécuter une fois dans Supabase : SQL Editor → New query → coller → Run.
-- Ré-exécutable sans risque (if not exists / or replace).

-- 1. Profil de chaque inscrit (créé automatiquement à l'inscription)
create table if not exists public.profils (
  id uuid primary key references auth.users (id) on delete cascade,
  prenom text check (char_length(prenom) <= 60),
  situation text check (char_length(situation) <= 40),
  beta boolean not null default true,
  progression jsonb not null default '{}'::jsonb,  -- épisodes écoutés, scores, révisions
  coach jsonb,                                     -- épreuves et créneaux du Coach
  cree_le timestamptz not null default now(),
  maj_le timestamptz not null default now()
);
alter table public.profils enable row level security;

drop policy if exists "profil lu par son titulaire" on public.profils;
create policy "profil lu par son titulaire" on public.profils
  for select to authenticated using (auth.uid() = id);
drop policy if exists "profil créé par son titulaire" on public.profils;
create policy "profil créé par son titulaire" on public.profils
  for insert to authenticated with check (auth.uid() = id);
drop policy if exists "profil modifié par son titulaire" on public.profils;
create policy "profil modifié par son titulaire" on public.profils
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

grant select, insert, update on public.profils to authenticated;

create or replace function public.creer_profil()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profils (id, prenom, situation)
  values (new.id, left(new.raw_user_meta_data ->> 'prenom', 60), left(new.raw_user_meta_data ->> 'situation', 40))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists a_l_inscription on auth.users;
create trigger a_l_inscription after insert on auth.users
  for each row execute function public.creer_profil();

-- 2. Avis des bêta-testeurs (lisibles par toi seul, dans Table Editor → avis)
create table if not exists public.avis (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  note smallint check (note between 1 and 5),
  message text not null check (char_length(message) between 1 and 2000),
  page text check (char_length(page) <= 200),
  cree_le timestamptz not null default now()
);
alter table public.avis enable row level security;

drop policy if exists "avis envoyé par un inscrit" on public.avis;
create policy "avis envoyé par un inscrit" on public.avis
  for insert to authenticated with check (user_id = auth.uid());

grant insert on public.avis to authenticated;

-- 3. Suppression de compte par l'utilisateur lui-même (RGPD : droit à l'effacement)
create or replace function public.supprimer_mon_compte()
returns void language sql security definer set search_path = '' as $$
  delete from auth.users where id = auth.uid();
$$;
revoke all on function public.supprimer_mon_compte() from public, anon;
grant execute on function public.supprimer_mon_compte() to authenticated;

-- 4. Nombre de bêta-testeurs, affiché sur la page d'accueil (aucune donnée personnelle)
create or replace function public.nb_beta()
returns bigint language sql security definer set search_path = '' stable as $$
  select count(*) from public.profils;
$$;
grant execute on function public.nb_beta() to anon, authenticated;
