// Fonction Supabase « stripe-webhook » : Stripe la prévient de chaque paiement, renouvellement ou résiliation,
// et elle met à jour la table `abonnements`. C'est la seule à pouvoir écrire dans cette table.
//
// Déploiement (tableau de bord Supabase) : Edge Functions → Deploy a new function → Via Editor,
// nom « stripe-webhook », coller ce fichier, puis désactiver « Verify JWT » (Stripe n'envoie pas de jeton Supabase).
// Secrets à créer (Edge Functions → Secrets) : STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET.
// SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont fournis automatiquement par Supabase, côté serveur uniquement.
//
// Le lien de paiement est ouvert par l'appli avec client_reference_id = "<id utilisateur>__<formule>__<ue>",
// par exemple "3f2c…__ue__ue2" ou "3f2c…__toutes__all".
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", { httpClient: Stripe.createFetchHttpClient() });
const crypto = Stripe.createSubtleCryptoProvider();
const admin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");

const UES = ["ue1", "ue2", "ue3", "ue4", "ue5"];

// Fin de période : selon la version de l'API Stripe, elle est sur l'abonnement ou sur sa première ligne
const finPeriode = (s: Stripe.Subscription) => {
  const t = (s as unknown as { current_period_end?: number }).current_period_end
    ?? (s.items?.data?.[0] as unknown as { current_period_end?: number } | undefined)?.current_period_end;
  return t ? new Date(t * 1000).toISOString() : null;
};

async function majAbonnement(s: Stripe.Subscription) {
  const { error } = await admin.from("abonnements").update({
    statut: s.status,
    fin_periode: finPeriode(s),
    resiliation_prevue: !!s.cancel_at_period_end,
    maj_le: new Date().toISOString(),
  }).eq("stripe_subscription", s.id);
  if (error) throw error;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok");
  const signature = req.headers.get("stripe-signature") ?? "";
  const corps = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(corps, signature, Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "", undefined, crypto);
  } catch {
    return new Response("Signature invalide", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const [userId, formule, ue] = (session.client_reference_id ?? "").split("__");
      if (!userId || !["ue", "toutes"].includes(formule) || !session.subscription) {
        console.error("Paiement sans référence exploitable", session.id, session.client_reference_id);
        return new Response("Référence manquante", { status: 200 }); // on ne fait pas réessayer Stripe
      }
      const sub = await stripe.subscriptions.retrieve(String(session.subscription));
      const { error } = await admin.from("abonnements").upsert({
        stripe_subscription: sub.id,
        user_id: userId,
        formule,
        ue: formule === "ue" && UES.includes(ue) ? ue : null,
        statut: sub.status,
        fin_periode: finPeriode(sub),
        resiliation_prevue: !!sub.cancel_at_period_end,
        stripe_customer: String(session.customer ?? ""),
        maj_le: new Date().toISOString(),
      });
      if (error) throw error;
    } else if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      await majAbonnement(event.data.object as Stripe.Subscription);
    }
  } catch (e) {
    console.error("Erreur de traitement", event.type, e);
    return new Response("Erreur, Stripe réessaiera", { status: 500 });
  }
  return new Response(JSON.stringify({ recu: true }), { headers: { "Content-Type": "application/json" } });
});
