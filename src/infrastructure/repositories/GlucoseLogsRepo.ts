import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { GlucoseLog } from "@/domain/types";

export class GlucoseLogsRepo {
  private getClient() {
    const cookieStore = cookies();
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name) => cookieStore.get(name)?.value } }
    );
  }

  async create(log: Omit<GlucoseLog, 'id' | 'created_at'>): Promise<GlucoseLog> {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('glucose_logs')
      .insert(log)
      .select()
      .single();

    if (error) throw new Error(`Failed to create glucose log: ${error.message}`);
    return data;
  }

  async listByRange(userId: string, from: string, to: string): Promise<GlucoseLog[]> {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('glucose_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('taken_at', from)
      .lte('taken_at', to)
      .order('taken_at', { ascending: false });

    if (error) throw new Error(`Failed to list glucose logs: ${error.message}`);
    return data || [];
  }

  async getById(id: string): Promise<GlucoseLog | null> {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('glucose_logs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to get glucose log: ${error.message}`);
    }
    return data;
  }
}