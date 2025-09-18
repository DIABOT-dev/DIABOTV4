import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "service-role-placeholder";

export const supabaseAdmin = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false }
});