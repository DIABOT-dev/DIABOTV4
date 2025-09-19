    return { id: data.id, status: 201 as const };
    if (error) throw error;
  },

};
      .single();
      .select("id")
      })
        // user_id để RLS tự điền theo session; không gửi từ UI
        taken_at: dto.taken_at,
        pulse: dto.pulse ?? null,
        diastolic: dto.diastolic,
        systolic: dto.systolic,
      .insert({
      .from("bp_logs")
    const { data, error } = await supabase
  async insert(dto: BPLog) {
export const BPRepo = {
import { BPLog } from '../../domain/types';
import { supabase } from '@/lib/supabase/client';