// ❌ BỎ: import { supabase } from "@/lib/supabase";

// ✅ THÊM:
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { WeightLogDTO } from "../../domain/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export const WeightRepo = {
  async insert(dto: WeightLogDTO) {
    const { data, error } = await supabase
      .from("weight_logs")
      .insert({
        weight_kg: dto.weight_kg,
        taken_at: dto.taken_at,
        // user_id để RLS tự điền theo session; không gửi từ UI
      })
      .select("id")
      .single();

    if (error) throw error;
    return { id: data.id, status: 201 as const };
  },
};
