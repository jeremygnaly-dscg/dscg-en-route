-- Zenvise · bilans hebdomadaires du Coach rédigés par l'IA.
-- À exécuter une fois dans Supabase : SQL Editor → New query → coller → Run. Ré-exécutable sans risque.
-- Seule la fonction « coach-bilan » écrit dans cette table ; chaque élève ne lit que ses bilans.

create table if not exists public.bilans (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  semaine date not null,                 -- lundi de la semaine concernée
  texte text not null,
  modele text,
  jetons_entree int,
  jetons_sortie int,
  cree_le timestamptz not null default now()
);
create index if not exists bilans_user_semaine on public.bilans (user_id, semaine);
create index if not exists bilans_cree_le on public.bilans (cree_le);

alter table public.bilans enable row level security;
drop policy if exists "bilan lu par son titulaire" on public.bilans;
create policy "bilan lu par son titulaire" on public.bilans
  for select to authenticated using (auth.uid() = user_id);
grant select on public.bilans to authenticated;
