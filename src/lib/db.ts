import { createClient } from '@supabase/supabase-js';

// Admin client instance cho server-side operations
let _adminInstance: any = null;
export const supabaseAdmin = (() => {
  if (_adminInstance) return _adminInstance;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  _adminInstance = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });