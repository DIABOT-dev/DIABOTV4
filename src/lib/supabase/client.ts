import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Single source of truth cho Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let _instance: SupabaseClient | null = null;

/**
 * Singleton Supabase client - compatible với cả pattern cũ và mới
 */
export function getSupabase(): SupabaseClient {
  if (!_instance) {
    _instance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _instance;
}

// Export const để code mới dùng: supabase.from()
export const supabase = getSupabase();

// Admin client cho server-side operations
export const supabaseAdmin = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};