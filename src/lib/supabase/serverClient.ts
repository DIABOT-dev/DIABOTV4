import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _sb: SupabaseClient | null = null;

export function serverSupabase(): SupabaseClient {
  if (_sb) return _sb;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !key) throw new Error("Missing Supabase env");
  _sb = createClient(url, key, { auth: { persistSession: false } });
  return _sb;
}

export const supabaseAdmin = serverSupabase(); // alias quen dùng