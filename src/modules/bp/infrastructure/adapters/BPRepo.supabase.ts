// src/modules/bp/infrastructure/adapters/BPRepo.supabase.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";
// Unified Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export const BPRepo = {
  async insert(dto: BPLog) {
    const { data, error } = await supabase
      .from("bp_logs")
      .insert({
        profile_id: dto.profile_id,   // giữ đồng bộ schema
        systolic: dto.systolic,
        diastolic: dto.diastolic,
        pulse: dto.pulse ?? null,
        taken_at: dto.taken_at,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async list(profile_id: string) {
    const { data, error } = await supabase
      .from("bp_logs")
      .select("*")
      .eq("profile_id", profile_id)
      .order("taken_at", { ascending: false });

    if (error) throw error;
    return data;