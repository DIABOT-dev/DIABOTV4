import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _instance: SupabaseClient | null = null;

export function createServerSupabase(): SupabaseClient {
  if (_instance) return _instance;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !key) throw new Error("Missing Supabase env");
  _instance = createClient(url, key, { auth: { persistSession: false } });
  return _instance;
}
