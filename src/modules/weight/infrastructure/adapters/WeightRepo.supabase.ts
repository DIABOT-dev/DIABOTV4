import { createClient } from "@supabase/supabase-js";
import { WeightLogDTO } from "../../domain/types";

// Direct import - không dùng alias để tránh lỗi resolve
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const WeightRepo = {
  async insert(dto: WeightLogDTO) {
    const { data, error } = await supabase
      .from("weight_logs")
      .insert({
        user_id: "demo-user", // fallback cho dev, sẽ được RLS handle
        weight_kg: dto.weight_kg,
        taken_at: dto.taken_at,
      })
      .select("id")
      .single();

    if (error) throw error;
    return { id: data.id, status: 201 as const };
  },
};