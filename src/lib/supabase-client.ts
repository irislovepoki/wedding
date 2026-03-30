import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "";
    if (!url || !key) {
      throw new Error("Supabase credentials not configured");
    }
    _client = createClient(url, key);
  }
  return _client;
}

const TABLE = "rsvp_submissions";

export type RSVPSubmission = {
  name: string;
  guests: number;
  submittedAt: string;
};

export async function fetchRSVPSubmissions(): Promise<RSVPSubmission[]> {
  const { data, error } = await getClient()
    .from(TABLE)
    .select("name, guests, submitted_at")
    .order("submitted_at", { ascending: false });

  if (error) throw new Error(`Supabase read failed: ${error.message}`);

  return (data ?? []).map((r) => ({
    name: r.name,
    guests: r.guests,
    submittedAt: r.submitted_at,
  }));
}

export async function submitRSVP(name: string, guests: number): Promise<void> {
  const { error } = await getClient()
    .from(TABLE)
    .insert({ name, guests, submitted_at: new Date().toISOString() });

  if (error) throw new Error(`Supabase write failed: ${error.message}`);
}
