import { createClient } from "@supabase/supabase-js";
import { MetricDay, MetricWeek } from "@/domain/types";

export class MetricsRepo {
  private getClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  async upsertDailyMetric(userId: string, day: string, metric: string, value: any): Promise<MetricDay> {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('metrics_day')
      .upsert({
        user_id: userId,
        day,
        metric,
        value,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to upsert daily metric: ${error.message}`);
    return data;
  }

  async getDailyMetrics(userId: string, fromDay: string, toDay: string, metric: string): Promise<MetricDay[]> {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('metrics_day')
      .select('*')
      .eq('user_id', userId)
      .eq('metric', metric)
      .gte('day', fromDay)
      .lte('day', toDay)
      .order('day', { ascending: true });

    if (error) throw new Error(`Failed to get daily metrics: ${error.message}`);
    return data || [];
  }

  async upsertWeeklyMetric(userId: string, week: number, metric: string, value: any): Promise<MetricWeek> {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('metrics_week')
      .upsert({
        user_id: userId,
        week,
        metric,
        value,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to upsert weekly metric: ${error.message}`);
    return data;
  }

  async getWeeklyMetrics(userId: string, fromWeek: number, toWeek: number, metric: string): Promise<MetricWeek[]> {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('metrics_week')
      .select('*')
      .eq('user_id', userId)
      .eq('metric', metric)
      .gte('week', fromWeek)
      .lte('week', toWeek)
      .order('week', { ascending: true });

    if (error) throw new Error(`Failed to get weekly metrics: ${error.message}`);
    return data || [];
  }
}