// src/modules/meal/infrastructure/MealRepo.supabase.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SaveMealLogDTO } from "../domain/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export class MealRepo {
  async insert(dto: SaveMealLogDTO, userId: string) {
    const { data, error } = await supabase.from("meal_logs").insert({
      profile_id: userId,
      meal_type: dto.meal_type,
      text: dto.text ?? null,
      portion: dto.portion,
      ts: dto.ts,
    }).select("*");
    if (error) throw new Error(error.message);
    return data;
  }
}
