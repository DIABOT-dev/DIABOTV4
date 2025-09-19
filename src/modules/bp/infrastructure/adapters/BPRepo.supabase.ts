import { createClient } from "@supabase/supabase-js";
import { BPLog } from "../../domain/types";

// Direct import - không dùng alias để tránh lỗi resolve
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const BPRepo = {
  async insert(dto: BPLog) {
    const { data, error } = await supabase
      .from("bp_logs")
      .insert({
        user_id: dto.user_id || "demo-user", // fallback cho dev
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

  async list(user_id: string) {
    const { data, error } = await supabase
      .from("bp_logs")
      .select("*")
      .eq("user_id", user_id)
      .order("taken_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};