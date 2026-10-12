// Connexion Supabase. L'URL et la clé « anon / publishable » sont publiques par nature :
// la sécurité est assurée par les règles (RLS) définies dans supabase/schema.sql.
// Ne JAMAIS mettre ici la clé service_role / secret.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://bojfsddycahfovufrqvp.supabase.co";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_KoshWZFhCzeZ_H_gvXDARQ_wFYxvi8c";

export const supabaseReady = () => !!SUPABASE_URL && !!SUPABASE_ANON_KEY;

// Les clés « publishable » (sb_publishable_…) passent seulement dans `apikey` ;
// les anciennes clés anon (JWT eyJ…) passent aussi dans Authorization.
const headers = (): Record<string, string> => ({
  apikey: SUPABASE_ANON_KEY,
  ...(SUPABASE_ANON_KEY.startsWith("eyJ") ? { Authorization: `Bearer ${SUPABASE_ANON_KEY}` } : {}),
  "Content-Type": "application/json",
});

export type JoinResult = "ok" | "already" | "error" | "offline";

export async function joinWaitlist(data: { email: string; ue: string; profil: string; source?: string }): Promise<JoinResult> {
  if (!supabaseReady()) return "offline";
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: "POST",
      headers: { ...headers(), Prefer: "return=minimal" },
      body: JSON.stringify({ ...data, email: data.email.trim().toLowerCase() }),
    });
    if (res.ok) return "ok";
    if (res.status === 409) return "already";
    return "error";
  } catch {
    return "error";
  }
}

export async function waitlistCount(): Promise<number | null> {
  if (!supabaseReady()) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/waitlist_count`, { method: "POST", headers: headers(), body: "{}" });
    if (!res.ok) return null;
    return Number(await res.json());
  } catch {
    return null;
  }
}
