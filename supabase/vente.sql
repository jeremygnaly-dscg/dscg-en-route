-- Révizen · vente : abonnements Stripe et preuve du consentement avant paiement.
-- À exécuter une fois dans Supabase : SQL Editor → New query → coller → Run.
-- Les abonnements sont écrits UNIQUEMENT par la fonction stripe-webhook (côté serveur).
-- L'appli peut seulement lire ceux de l'utilisateur connecté.

create table if not exists public.abonnements (
  stripe_subscription text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  formule text not null check (formule in ('ue', 'toutes')),
  ue text check (ue in ('ue1', 'ue2', 'ue3', 'ue4', 'ue5')),
  statut text not null,                 -- active, trialing, past_due, canceled, unpaid…
  fin_periode timestamptz,              -- fin de la période payée
  resiliation_prevue boolean not null default false,
  stripe_customer text,
  cree_le timestamptz not null default now(),
  maj_le timestamptz not null default now()
);
create index if not exists abonnements_user on public.abonnements (user_id);
alter table public.abonnements enable row level security;

drop policy if exists "abonnements lus par leur titulaire" on public.abonnements;
create policy "abonnements lus par leur titulaire" on public.abonnements
  for select to authenticated using (auth.uid() = user_id);
grant select on public.abonnements to authenticated;

-- Preuve de l'acceptation des CGV et de la renonciation au droit de rétractation (art. L. 221-28 C. consom.)
create table if not exists public.consentements (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  objet text not null check (char_length(objet) <= 500),
  cree_le timestamptz not null default now()
);
alter table public.consentements enable row level security;
drop policy if exists "consentement enregistré par son titulaire" on public.consentements;
create policy "consentement enregistré par son titulaire" on public.consentements
  for insert to authenticated with check (user_id = auth.uid());
grant insert on public.consentements to authenticated;
