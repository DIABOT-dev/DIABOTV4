import { supabase } from '@/lib/supabase/client';

// Cache cho context - 5 phút
const contextCache = new Map<string, { data: UserContext; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 phút

export interface UserContext {
  summary: string;
  metrics: {
    bg_latest?: { value: number; unit: string; hours_ago: number };
    bg_avg_7d?: number;
    water_today_ml?: number;
    water_avg_7d?: number;
    weight_latest?: { kg: number; days_ago: number };
    bp_latest?: { systolic: number; diastolic: number; hours_ago: number };
    insulin_total_7d?: number;
    logs_count_7d: {
      glucose: number;
      water: number;
      weight: number;
      bp: number;
      insulin: number;
    };
  };
}

/**
 * Đọc dữ liệu 7 ngày gần nhất của user để build context cho AI
 * Cache 5 phút để tránh query liên tục
 */
export async function buildContext(user_id: string): Promise<UserContext> {
  // Kiểm tra cache
  const cached = contextCache.get(user_id);
  if (cached && Date.now() < cached.expires) {
    return cached.data;
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  try {
    // Đọc song song tất cả logs 7 ngày
    const [glucoseData, waterData, weightData, bpData, insulinData] = await Promise.all([
      // Glucose logs
      supabase
        .from('glucose_logs')
        .select('value_mgdl, taken_at')
        .eq('user_id', user_id)
        .gte('taken_at', sevenDaysAgo.toISOString())
        .order('taken_at', { ascending: false }),

      // Water logs
      supabase
        .from('water_logs')
        .select('amount_ml, taken_at')
        .eq('user_id', user_id)
        .gte('taken_at', sevenDaysAgo.toISOString())
        .order('taken_at', { ascending: false }),

      // Weight logs
      supabase
        .from('weight_logs')
        .select('weight_kg, taken_at')
        .eq('user_id', user_id)
        .gte('taken_at', sevenDaysAgo.toISOString())
        .order('taken_at', { ascending: false }),

      // BP logs
      supabase
        .from('bp_logs')
        .select('systolic, diastolic, taken_at')
        .eq('user_id', user_id)
        .gte('taken_at', sevenDaysAgo.toISOString())
        .order('taken_at', { ascending: false }),

      // Insulin logs
      supabase
        .from('insulin_logs')
        .select('dose_units, taken_at')
        .eq('user_id', user_id)
        .gte('taken_at', sevenDaysAgo.toISOString())
        .order('taken_at', { ascending: false })
    ]);

    // Xử lý glucose
    const glucoseLogs = glucoseData.data || [];
    const bg_latest = glucoseLogs[0] ? {
      value: glucoseLogs[0].value_mgdl,
      unit: 'mg/dL',
      hours_ago: Math.floor((now.getTime() - new Date(glucoseLogs[0].taken_at).getTime()) / (60 * 60 * 1000))
    } : undefined;

    const bg_avg_7d = glucoseLogs.length > 0 
      ? Math.round(glucoseLogs.reduce((sum, log) => sum + log.value_mgdl, 0) / glucoseLogs.length)
      : undefined;

    // Xử lý water
    const waterLogs = waterData.data || [];
    const waterToday = waterLogs.filter(log => 
      new Date(log.taken_at) >= todayStart
    );
    const water_today_ml = waterToday.reduce((sum, log) => sum + log.amount_ml, 0);
    const water_avg_7d = waterLogs.length > 0
      ? Math.round(waterLogs.reduce((sum, log) => sum + log.amount_ml, 0) / 7)
      : undefined;

    // Xử lý weight
    const weightLogs = weightData.data || [];
    const weight_latest = weightLogs[0] ? {
      kg: weightLogs[0].weight_kg,
      days_ago: Math.floor((now.getTime() - new Date(weightLogs[0].taken_at).getTime()) / (24 * 60 * 60 * 1000))
    } : undefined;

    // Xử lý BP
    const bpLogs = bpData.data || [];
    const bp_latest = bpLogs[0] ? {
      systolic: bpLogs[0].systolic,
      diastolic: bpLogs[0].diastolic,
      hours_ago: Math.floor((now.getTime() - new Date(bpLogs[0].taken_at).getTime()) / (60 * 60 * 1000))
    } : undefined;

    // Xử lý insulin
    const insulinLogs = insulinData.data || [];
    const insulin_total_7d = insulinLogs.reduce((sum, log) => sum + log.dose_units, 0);

    // Tạo summary
    const summary = generateSummary({
      bg_latest,
      bg_avg_7d,
      water_today_ml,
      weight_latest,
      bp_latest,
      logs_count: {
        glucose: glucoseLogs.length,
        water: waterLogs.length,
        weight: weightLogs.length,
        bp: bpLogs.length,
        insulin: insulinLogs.length
      }
    });

    const context: UserContext = {
      summary,
      metrics: {
        bg_latest,
        bg_avg_7d,
        water_today_ml,
        water_avg_7d,
        weight_latest,
        bp_latest,
        insulin_total_7d,
        logs_count_7d: {
          glucose: glucoseLogs.length,
          water: waterLogs.length,
          weight: weightLogs.length,
          bp: bpLogs.length,
          insulin: insulinLogs.length
        }
      }
    };

    // Lưu cache
    contextCache.set(user_id, {
      data: context,
      expires: Date.now() + CACHE_TTL
    });

    return context;

  } catch (error) {
    console.error('Error building user context:', error);
    
    // Fallback context khi lỗi
    return {
      summary: 'Không thể tải dữ liệu người dùng. Vui lòng thử lại sau.',
      metrics: {
        logs_count_7d: {
          glucose: 0,
          water: 0,
          weight: 0,
          bp: 0,
          insulin: 0
        }
      }
    };
  }
}

/**
 * Tạo summary text từ metrics
 */
function generateSummary(data: any): string {
  const parts: string[] = [];

  // BG summary
  if (data.bg_latest) {
    parts.push(`Đường huyết gần nhất: ${data.bg_latest.value} mg/dL (${data.bg_latest.hours_ago}h trước)`);
  }
  if (data.bg_avg_7d) {
    parts.push(`Trung bình 7 ngày: ${data.bg_avg_7d} mg/dL`);
  }

  // Water summary
  if (data.water_today_ml > 0) {
    parts.push(`Nước hôm nay: ${data.water_today_ml}ml`);
  }

  // Weight summary
  if (data.weight_latest) {
    parts.push(`Cân nặng: ${data.weight_latest.kg}kg (${data.weight_latest.days_ago} ngày trước)`);
  }

  // BP summary
  if (data.bp_latest) {
    parts.push(`Huyết áp: ${data.bp_latest.systolic}/${data.bp_latest.diastolic} mmHg (${data.bp_latest.hours_ago}h trước)`);
  }

  // Activity summary
  const totalLogs = Object.values(data.logs_count).reduce((sum: number, count: any) => sum + count, 0);
  parts.push(`Tổng ${totalLogs} bản ghi trong 7 ngày`);

  return parts.join('. ') + '.';
}

/**
 * Clear cache cho user (dùng khi có log mới)
 */
export function clearUserContextCache(user_id: string): void {
  contextCache.delete(user_id);
}