-- Zenvise · réseau des étudiants DCG / DSCG : profils, entraide par UE, réactions et commentaires sur le fil,
-- défis (points et classement), suivis, messages privés, blocages et signalements.
-- À exécuter une fois dans Supabase : SQL Editor → New query → coller → Run. Ré-exécutable sans risque.
--
-- Modération : tout contenu signalé par 3 membres différents est masqué automatiquement.
-- Les signalements se consultent dans Table Editor → signalements ; pour rétablir un contenu, remettre « masque » à false.

-- ───────────────────────── 1. Profil public ─────────────────────────
create table if not exists public.membres (
  id uuid primary key references auth.users (id) on delete cascade,
  pseudo text not null check (pseudo ~ '^[A-Za-z0-9_.-]{3,20}$'),
  prenom text check (char_length(prenom) <= 40),
  diplome text not null check (diplome in ('dcg', 'dscg', 'cca', 'autre')),
  ues text[] not null default '{}' check (cardinality(ues) <= 13),
  ecole text check (char_length(ecole) <= 80),
  situation text check (char_length(situation) <= 40),
  bio text check (char_length(bio) <= 280),
  couleur smallint not null default 0 check (couleur between 0 and 7),
  messages_ouverts boolean not null default true,
  cree_le timestamptz not null default now(),
  vu_le timestamptz not null default now()
);
create unique index if not exists membres_pseudo_unique on public.membres (lower(pseudo));
alter table public.membres enable row level security;
drop policy if exists "membres visibles des inscrits" on public.membres;
create policy "membres visibles des inscrits" on public.membres for select to authenticated using (true);
drop policy if exists "profil créé par son titulaire" on public.membres;
create policy "profil créé par son titulaire" on public.membres for insert to authenticated with check (id = auth.uid());
drop policy if exists "profil modifié par son titulaire" on public.membres;
create policy "profil modifié par son titulaire" on public.membres for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
grant select, insert, update on public.membres to authenticated;

-- ───────────────────────── 2. Suivis et blocages ─────────────────────────
create table if not exists public.suivis (
  suiveur uuid not null default auth.uid() references public.membres (id) on delete cascade,
  suivi uuid not null references public.membres (id) on delete cascade,
  cree_le timestamptz not null default now(),
  primary key (suiveur, suivi),
  check (suiveur <> suivi)
);
alter table public.suivis enable row level security;
drop policy if exists "suivis visibles" on public.suivis;
create policy "suivis visibles" on public.suivis for select to authenticated using (true);
drop policy if exists "suivre" on public.suivis;
create policy "suivre" on public.suivis for insert to authenticated with check (suiveur = auth.uid());
drop policy if exists "ne plus suivre" on public.suivis;
create policy "ne plus suivre" on public.suivis for delete to authenticated using (suiveur = auth.uid());
grant select, insert, delete on public.suivis to authenticated;

create table if not exists public.blocages (
  bloqueur uuid not null default auth.uid() references public.membres (id) on delete cascade,
  bloque uuid not null references public.membres (id) on delete cascade,
  cree_le timestamptz not null default now(),
  primary key (bloqueur, bloque),
  check (bloqueur <> bloque)
);
alter table public.blocages enable row level security;
drop policy if exists "mes blocages" on public.blocages;
create policy "mes blocages" on public.blocages for select to authenticated using (bloqueur = auth.uid());
drop policy if exists "bloquer" on public.blocages;
create policy "bloquer" on public.blocages for insert to authenticated with check (bloqueur = auth.uid());
drop policy if exists "débloquer" on public.blocages;
create policy "débloquer" on public.blocages for delete to authenticated using (bloqueur = auth.uid());
grant select, insert, delete on public.blocages to authenticated;

create or replace function public.bloque_entre(x uuid, y uuid)
returns boolean language sql security definer set search_path = '' stable as $$
  select exists (select 1 from public.blocages where (bloqueur = x and bloque = y) or (bloqueur = y and bloque = x));
$$;
revoke all on function public.bloque_entre(uuid, uuid) from public, anon;
grant execute on function public.bloque_entre(uuid, uuid) to authenticated;

-- Limite de publication : au plus `n` éléments par heure et par auteur dans une table
create or replace function public.limiter_debit()
returns trigger language plpgsql security definer set search_path = '' as $$
declare n int; plafond int := tg_argv[0]::int;
begin
  execute format('select count(*) from public.%I where auteur = $1 and cree_le > now() - interval ''1 hour''', tg_table_name)
    into n using new.auteur;
  if n >= plafond then
    raise exception 'debit_depasse' using hint = 'Trop de publications en une heure. Réessaie plus tard.';
  end if;
  return new;
end $$;

-- ───────────────────────── 3. Entraide par UE ─────────────────────────
create table if not exists public.questions (
  id bigint generated always as identity primary key,
  auteur uuid not null default auth.uid() references public.membres (id) on delete cascade,
  ue text not null check (ue ~ '^(ue[1-5]|dcg([1-9]|1[0-3]))$'),
  titre text not null check (char_length(titre) between 8 and 140),
  corps text not null default '' check (char_length(corps) <= 3000),
  meilleure_reponse bigint,
  nb_reponses int not null default 0,
  nb_utiles int not null default 0,
  masque boolean not null default false,
  cree_le timestamptz not null default now(),
  maj_le timestamptz not null default now()
);
create index if not exists questions_ue on public.questions (ue, cree_le desc);
alter table public.questions enable row level security;
drop policy if exists "questions visibles" on public.questions;
create policy "questions visibles" on public.questions for select to authenticated using (not masque or auteur = auth.uid());
drop policy if exists "poser une question" on public.questions;
create policy "poser une question" on public.questions for insert to authenticated with check (auteur = auth.uid());
drop policy if exists "modifier sa question" on public.questions;
create policy "modifier sa question" on public.questions for update to authenticated using (auteur = auth.uid()) with check (auteur = auth.uid());
drop policy if exists "supprimer sa question" on public.questions;
create policy "supprimer sa question" on public.questions for delete to authenticated using (auteur = auth.uid());
grant select, delete on public.questions to authenticated;
grant insert (ue, titre, corps) on public.questions to authenticated;
grant update (titre, corps, meilleure_reponse) on public.questions to authenticated;

drop trigger if exists questions_debit on public.questions;
create trigger questions_debit before insert on public.questions for each row execute function public.limiter_debit('10');

create table if not exists public.reponses (
  id bigint generated always as identity primary key,
  question_id bigint not null references public.questions (id) on delete cascade,
  auteur uuid not null default auth.uid() references public.membres (id) on delete cascade,
  corps text not null check (char_length(corps) between 1 and 3000),
  nb_utiles int not null default 0,
  masque boolean not null default false,
  cree_le timestamptz not null default now()
);
create index if not exists reponses_question on public.reponses (question_id, cree_le);
alter table public.reponses enable row level security;
drop policy if exists "réponses visibles" on public.reponses;
create policy "réponses visibles" on public.reponses for select to authenticated using (not masque or auteur = auth.uid());
drop policy if exists "répondre" on public.reponses;
create policy "répondre" on public.reponses for insert to authenticated with check (auteur = auth.uid());
drop policy if exists "supprimer sa réponse" on public.reponses;
create policy "supprimer sa réponse" on public.reponses for delete to authenticated using (auteur = auth.uid());
grant select, delete on public.reponses to authenticated;
grant insert (question_id, corps) on public.reponses to authenticated;

drop trigger if exists reponses_debit on public.reponses;
create trigger reponses_debit before insert on public.reponses for each row execute function public.limiter_debit('30');

create or replace function public.compter_reponses()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.questions q set nb_reponses = (select count(*) from public.reponses r where r.question_id = q.id and not r.masque)
  where q.id = coalesce(new.question_id, old.question_id);
  return null;
end $$;
drop trigger if exists reponses_compte on public.reponses;
create trigger reponses_compte after insert or delete or update of masque on public.reponses for each row execute function public.compter_reponses();

-- La meilleure réponse doit appartenir à la question
create or replace function public.verifier_meilleure_reponse()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.meilleure_reponse is not null and not exists (select 1 from public.reponses where id = new.meilleure_reponse and question_id = new.id) then
    raise exception 'reponse_invalide';
  end if;
  new.maj_le := now();
  return new;
end $$;
drop trigger if exists questions_meilleure on public.questions;
create trigger questions_meilleure before update on public.questions for each row execute function public.verifier_meilleure_reponse();

-- ───────────────────────── 4. Commentaires sur le fil ─────────────────────────
create table if not exists public.commentaires (
  id bigint generated always as identity primary key,
  actu_id text not null check (char_length(actu_id) between 1 and 160),
  auteur uuid not null default auth.uid() references public.membres (id) on delete cascade,
  corps text not null check (char_length(corps) between 1 and 1000),
  masque boolean not null default false,
  cree_le timestamptz not null default now()
);
create index if not exists commentaires_actu on public.commentaires (actu_id, cree_le);
alter table public.commentaires enable row level security;
drop policy if exists "commentaires visibles" on public.commentaires;
create policy "commentaires visibles" on public.commentaires for select to authenticated using (not masque or auteur = auth.uid());
drop policy if exists "commenter" on public.commentaires;
create policy "commenter" on public.commentaires for insert to authenticated with check (auteur = auth.uid());
drop policy if exists "supprimer son commentaire" on public.commentaires;
create policy "supprimer son commentaire" on public.commentaires for delete to authenticated using (auteur = auth.uid());
grant select, delete on public.commentaires to authenticated;
grant insert (actu_id, corps) on public.commentaires to authenticated;

drop trigger if exists commentaires_debit on public.commentaires;
create trigger commentaires_debit before insert on public.commentaires for each row execute function public.limiter_debit('30');

-- ───────────────────────── 5. Réactions « utile » ─────────────────────────
create table if not exists public.reactions (
  cible_type text not null check (cible_type in ('actu', 'question', 'reponse', 'commentaire')),
  cible_id text not null check (char_length(cible_id) between 1 and 160),
  auteur uuid not null default auth.uid() references public.membres (id) on delete cascade,
  cree_le timestamptz not null default now(),
  primary key (cible_type, cible_id, auteur)
);
alter table public.reactions enable row level security;
drop policy if exists "réactions visibles" on public.reactions;
create policy "réactions visibles" on public.reactions for select to authenticated using (true);
drop policy if exists "réagir" on public.reactions;
create policy "réagir" on public.reactions for insert to authenticated with check (auteur = auth.uid());
drop policy if exists "retirer sa réaction" on public.reactions;
create policy "retirer sa réaction" on public.reactions for delete to authenticated using (auteur = auth.uid());
grant select, delete on public.reactions to authenticated;
grant insert (cible_type, cible_id) on public.reactions to authenticated;

create or replace function public.compter_utiles()
returns trigger language plpgsql security definer set search_path = '' as $$
declare t text := coalesce(new.cible_type, old.cible_type); c text := coalesce(new.cible_id, old.cible_id); n int;
begin
  select count(*) into n from public.reactions where cible_type = t and cible_id = c;
  if t = 'question' and c ~ '^\d+$' then update public.questions set nb_utiles = n where id = c::bigint;
  elsif t = 'reponse' and c ~ '^\d+$' then update public.reponses set nb_utiles = n where id = c::bigint;
  end if;
  return null;
end $$;
drop trigger if exists reactions_compte on public.reactions;
create trigger reactions_compte after insert or delete on public.reactions for each row execute function public.compter_utiles();

-- Compteurs des actus du fil en un seul appel
create or replace function public.compteurs_actus(ids text[])
returns table (actu_id text, utiles bigint, commentaires bigint, moi boolean)
language sql security definer set search_path = '' stable as $$
  select i,
    (select count(*) from public.reactions r where r.cible_type = 'actu' and r.cible_id = i),
    (select count(*) from public.commentaires c where c.actu_id = i and not c.masque),
    exists (select 1 from public.reactions r where r.cible_type = 'actu' and r.cible_id = i and r.auteur = auth.uid())
  from unnest(ids[1:100]) as i;
$$;
revoke all on function public.compteurs_actus(text[]) from public, anon;
grant execute on function public.compteurs_actus(text[]) to authenticated;

-- ───────────────────────── 6. Défis : points, séries, classement ─────────────────────────
create table if not exists public.points (
  membre uuid not null references public.membres (id) on delete cascade,
  jour date not null,
  points int not null default 0,
  quiz int not null default 0,
  primary key (membre, jour)
);
alter table public.points enable row level security;
drop policy if exists "points visibles" on public.points;
create policy "points visibles" on public.points for select to authenticated using (true);
grant select on public.points to authenticated;

create or replace function public.jour_paris() returns date language sql stable set search_path = '' as $$
  select (now() at time zone 'Europe/Paris')::date;
$$;

-- Appelée à la fin de chaque quiz : 10 points + 5 par bonne réponse. Plafond : 30 quiz et 300 points par jour.
create or replace function public.ajouter_points(bonnes int, total int)
returns table (points_jour int, points_semaine bigint, serie int)
language plpgsql security definer set search_path = '' as $$
declare j date := public.jour_paris(); gain int;
begin
  if not exists (select 1 from public.membres where id = auth.uid()) then
    raise exception 'profil_requis';
  end if;
  total := least(greatest(total, 0), 10);
  bonnes := least(greatest(bonnes, 0), total);
  gain := 10 + 5 * bonnes;
  insert into public.points (membre, jour, points, quiz) values (auth.uid(), j, 0, 0) on conflict do nothing;
  update public.points p set points = least(p.points + gain, 300), quiz = p.quiz + 1
    where p.membre = auth.uid() and p.jour = j and p.quiz < 30;
  update public.membres set vu_le = now() where id = auth.uid();
  return query select * from public.mes_points();
end $$;
revoke all on function public.ajouter_points(int, int) from public, anon;
grant execute on function public.ajouter_points(int, int) to authenticated;

create or replace function public.mes_points()
returns table (points_jour int, points_semaine bigint, serie int)
language plpgsql security definer set search_path = '' stable as $$
declare j date := public.jour_paris(); s int := 0; d date;
begin
  -- Série : jours consécutifs avec au moins un quiz, jusqu'à aujourd'hui (ou hier si rien encore aujourd'hui)
  d := case when exists (select 1 from public.points where membre = auth.uid() and jour = j and quiz > 0) then j else j - 1 end;
  while exists (select 1 from public.points where membre = auth.uid() and jour = d and quiz > 0) loop
    s := s + 1; d := d - 1;
  end loop;
  return query select
    coalesce((select p.points from public.points p where p.membre = auth.uid() and p.jour = j), 0),
    coalesce((select sum(p.points) from public.points p where p.membre = auth.uid() and p.jour >= date_trunc('week', j)::date), 0),
    s;
end $$;
revoke all on function public.mes_points() from public, anon;
grant execute on function public.mes_points() to authenticated;

-- Classement de la semaine : tous les membres d'un diplôme, ou seulement les membres suivis (et soi-même)
create or replace function public.classement(p_diplome text default null, p_suivis boolean default false)
returns table (membre uuid, pseudo text, couleur smallint, diplome text, points bigint, rang bigint)
language sql security definer set search_path = '' stable as $$
  with semaine as (
    select p.membre, sum(p.points) as pts from public.points p
    where p.jour >= date_trunc('week', public.jour_paris())::date group by p.membre
  )
  select m.id, m.pseudo, m.couleur, m.diplome, s.pts, rank() over (order by s.pts desc)
  from semaine s join public.membres m on m.id = s.membre
  where (p_diplome is null or m.diplome = p_diplome)
    and (not p_suivis or m.id = auth.uid() or exists (select 1 from public.suivis f where f.suiveur = auth.uid() and f.suivi = m.id))
  order by s.pts desc limit 50;
$$;
revoke all on function public.classement(text, boolean) from public, anon;
grant execute on function public.classement(text, boolean) to authenticated;

-- ───────────────────────── 7. Messages privés ─────────────────────────
create table if not exists public.conversations (
  id bigint generated always as identity primary key,
  a uuid not null references public.membres (id) on delete cascade,
  b uuid not null references public.membres (id) on delete cascade,
  cree_le timestamptz not null default now(),
  dernier_le timestamptz not null default now(),
  check (a < b),
  unique (a, b)
);
alter table public.conversations enable row level security;
drop policy if exists "mes conversations" on public.conversations;
create policy "mes conversations" on public.conversations for select to authenticated using (auth.uid() in (a, b));
grant select on public.conversations to authenticated;

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  conversation_id bigint not null references public.conversations (id) on delete cascade,
  auteur uuid not null default auth.uid() references public.membres (id) on delete cascade,
  corps text not null check (char_length(corps) between 1 and 2000),
  lu_le timestamptz,
  masque boolean not null default false,
  cree_le timestamptz not null default now()
);
create index if not exists messages_conv on public.messages (conversation_id, cree_le);
alter table public.messages enable row level security;

create or replace function public.participe(conv bigint)
returns boolean language sql security definer set search_path = '' stable as $$
  select exists (select 1 from public.conversations c where c.id = conv and auth.uid() in (c.a, c.b));
$$;
revoke all on function public.participe(bigint) from public, anon;
grant execute on function public.participe(bigint) to authenticated;

drop policy if exists "lire mes messages" on public.messages;
create policy "lire mes messages" on public.messages for select to authenticated using (public.participe(conversation_id));
drop policy if exists "écrire dans mes conversations" on public.messages;
create policy "écrire dans mes conversations" on public.messages for insert to authenticated with check (
  auteur = auth.uid() and public.participe(conversation_id)
  and not exists (select 1 from public.conversations c where c.id = conversation_id and public.bloque_entre(c.a, c.b))
);
grant select on public.messages to authenticated;
grant insert (conversation_id, corps) on public.messages to authenticated;

drop trigger if exists messages_debit on public.messages;
create trigger messages_debit before insert on public.messages for each row execute function public.limiter_debit('60');

create or replace function public.message_envoye()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.conversations set dernier_le = new.cree_le where id = new.conversation_id;
  return null;
end $$;
drop trigger if exists messages_dernier on public.messages;
create trigger messages_dernier after insert on public.messages for each row execute function public.message_envoye();

-- Ouvre (ou retrouve) la conversation avec un membre
create or replace function public.ouvrir_conversation(autre uuid)
returns bigint language plpgsql security definer set search_path = '' as $$
declare moi uuid := auth.uid(); x uuid; y uuid; cid bigint;
begin
  if moi is null or autre is null or moi = autre then raise exception 'conversation_invalide'; end if;
  if not exists (select 1 from public.membres where id = moi) then raise exception 'profil_requis'; end if;
  if public.bloque_entre(moi, autre) then raise exception 'bloque'; end if;
  x := least(moi, autre); y := greatest(moi, autre);
  select id into cid from public.conversations where a = x and b = y;
  if cid is null then
    if not exists (select 1 from public.membres where id = autre and messages_ouverts) then raise exception 'messages_fermes'; end if;
    insert into public.conversations (a, b) values (x, y) returning id into cid;
  end if;
  return cid;
end $$;
revoke all on function public.ouvrir_conversation(uuid) from public, anon;
grant execute on function public.ouvrir_conversation(uuid) to authenticated;

create or replace function public.marquer_lu(conv bigint)
returns void language sql security definer set search_path = '' as $$
  update public.messages set lu_le = now()
  where conversation_id = conv and auteur <> auth.uid() and lu_le is null and public.participe(conv);
$$;
revoke all on function public.marquer_lu(bigint) from public, anon;
grant execute on function public.marquer_lu(bigint) to authenticated;

create or replace function public.mes_conversations()
returns table (id bigint, autre uuid, pseudo text, couleur smallint, diplome text, dernier text, dernier_le timestamptz, non_lus bigint, bloque boolean)
language sql security definer set search_path = '' stable as $$
  select c.id, m.id, m.pseudo, m.couleur, m.diplome,
    (select left(x.corps, 120) from public.messages x where x.conversation_id = c.id and not x.masque order by x.cree_le desc limit 1),
    c.dernier_le,
    (select count(*) from public.messages x where x.conversation_id = c.id and x.auteur <> auth.uid() and x.lu_le is null),
    public.bloque_entre(c.a, c.b)
  from public.conversations c
  join public.membres m on m.id = case when c.a = auth.uid() then c.b else c.a end
  where auth.uid() in (c.a, c.b)
  order by c.dernier_le desc limit 100;
$$;
revoke all on function public.mes_conversations() from public, anon;
grant execute on function public.mes_conversations() to authenticated;

-- Temps réel : les nouveaux messages arrivent sans recharger
do $$ begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'messages') then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;

-- ───────────────────────── 8. Signalements et masquage automatique ─────────────────────────
create table if not exists public.signalements (
  id bigint generated always as identity primary key,
  auteur uuid not null default auth.uid() references auth.users (id) on delete cascade,
  cible_type text not null check (cible_type in ('question', 'reponse', 'commentaire', 'message', 'membre')),
  cible_id text not null check (char_length(cible_id) between 1 and 160),
  motif text not null check (char_length(motif) between 1 and 500),
  traite boolean not null default false,
  cree_le timestamptz not null default now(),
  unique (auteur, cible_type, cible_id)
);
alter table public.signalements enable row level security;
drop policy if exists "signaler" on public.signalements;
create policy "signaler" on public.signalements for insert to authenticated with check (auteur = auth.uid());
grant insert (cible_type, cible_id, motif) on public.signalements to authenticated;

create or replace function public.masquer_si_signale()
returns trigger language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  if new.cible_id !~ '^\d+$' then return null; end if;
  select count(distinct auteur) into n from public.signalements where cible_type = new.cible_type and cible_id = new.cible_id;
  -- Un message privé signalé par son destinataire est masqué tout de suite ; le reste à partir de 3 signalements
  if new.cible_type = 'message' then
    update public.messages m set masque = true where m.id = new.cible_id::bigint and m.auteur <> new.auteur and public.participe(m.conversation_id);
  elsif n >= 3 then
    if new.cible_type = 'question' then update public.questions set masque = true where id = new.cible_id::bigint;
    elsif new.cible_type = 'reponse' then update public.reponses set masque = true where id = new.cible_id::bigint;
    elsif new.cible_type = 'commentaire' then update public.commentaires set masque = true where id = new.cible_id::bigint;
    end if;
  end if;
  return null;
end $$;
drop trigger if exists signalements_masquage on public.signalements;
create trigger signalements_masquage after insert on public.signalements for each row execute function public.masquer_si_signale();

-- ───────────────────────── 9. Vie du réseau (compteurs sans donnée personnelle) ─────────────────────────
create or replace function public.pouls_reseau()
returns table (membres bigint, actifs_semaine bigint, questions_semaine bigint)
language sql security definer set search_path = '' stable as $$
  select (select count(*) from public.membres),
    (select count(*) from public.membres where vu_le > now() - interval '7 days'),
    (select count(*) from public.questions where cree_le > now() - interval '7 days' and not masque);
$$;
grant execute on function public.pouls_reseau() to authenticated;
