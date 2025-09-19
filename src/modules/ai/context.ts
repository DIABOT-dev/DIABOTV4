import { supabaseAdmin } from '@/lib/db';
import type { AIContext, MetricPoint, BPPoint } from './types';

// Cache cho context - 5 phút
const contextCache = new Map<string, { data: AIContext; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 phút

/**
 * Đọc dữ liệu 7 ngày gần nhất của user để build context cho AI
 * Cache 5 phút để tránh query liên tục
 */
export async function buildContext(userId: string): Promise<AIContext> {
  // Kiểm tra cache
  const cached = contextCache.get(userId);
  if (cached && Date.now() < cached.expires) {
    return cached.data;
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  try {
    // Đọc song song tất cả logs 7 ngày
    const [glucoseData, waterData, weightData, bpData, insulinData] = await Promise.all([
      // Glucose logs - map cột chuẩn
      supabaseAdmin
        .from('glucose_logs')
        .select('value_mgdl, taken_at')
        .eq('user_id', userId)
        .gte('taken_at', sevenDaysAgo.toISOString())
        .order('taken_at', { ascending: false }),

      // Water logs - map cột chuẩn  
      supabaseAdmin
        .from('water_logs')
        .select('amount_ml, taken_at')
        .eq('user_id', userId)
        .gte('taken_at', sevenDaysAgo.toISOString())
        .order('taken_at', { ascending: false }),

      // Weight logs - map cột chuẩn
      supabaseAdmin
        .from('weight_logs')
        .select('weight_kg, taken_at')
        .eq('user_id', userId)
        .gte('taken_at', sevenDaysAgo.toISOString())
        .order('taken_at', { ascending: false }),

      // BP logs - map cột chuẩn
      supabaseAdmin
        .from('bp_logs')
        .select('systolic, diastolic, taken_at')
        .eq('user_id', userId)
        .gte('taken_at', sevenDaysAgo.toISOString())
        .order('taken_at', { ascending: false }),

      // Insulin logs - map cột chuẩn
      supabaseAdmin
        .from('insulin_logs')
        .select('dose_units, taken_at')
        .eq('user_id', userId)
        .gte('taken_at', sevenDaysAgo.toISOString())
        .order('taken_at', { ascending: false })
    ]);

    // Xử lý glucose
    const glucoseLogs = glucoseData.data || [];
    const bg: MetricPoint[] = glucoseLogs.map(log => ({
      ts: log.taken_at,
      value: log.value_mgdl
    }));

    // Xử lý water
    const waterLogs = waterData.data || [];
    const water: MetricPoint[] = waterLogs.map(log => ({
      ts: log.taken_at,
      value: log.amount_ml
    }));

    // Xử lý weight
    const weightLogs = weightData.data || [];
    const weight: MetricPoint[] = weightLogs.map(log => ({
      ts: log.taken_at,
      value: log.weight_kg
    }));

    // Xử lý BP
    const bpLogs = bpData.data || [];
    const bp: BPPoint[] = bpLogs.map(log => ({
      ts: log.taken_at,
      sys: log.systolic,
      dia: log.diastolic
    }));

    // Xử lý insulin
    const insulinLogs = insulinData.data || [];
    const insulin: MetricPoint[] = insulinLogs.map(log => ({
      ts: log.taken_at,
      value: log.dose_units
    }));

    // Latest values
    const latest = {
      bg: bg[0]?.value,
      bp: bp[0] ? { sys: bp[0].sys, dia: bp[0].dia } : undefined,
      weight: weight[0]?.value
    };

    // Tạo summary
    const summaryParts: string[] = [];
    if (latest.bg) summaryParts.push(`BG gần nhất: ${latest.bg} mg/dL`);
    if (latest.bp) summaryParts.push(`BP: ${latest.bp.sys}/${latest.bp.dia} mmHg`);
    if (latest.weight) summaryParts.push(`Cân nặng: ${latest.weight} kg`);
    
    const totalLogs = bg.length + water.length + weight.length + bp.length + insulin.length;
    summaryParts.push(`${totalLogs} bản ghi trong 7 ngày`);
    
    if (water.length > 0) {
      const avgWater = water.reduce((sum, w) => sum + w.value, 0) / 7;
      summaryParts.push(`Nước TB: ${Math.round(avgWater)}ml/ngày`);
    }

    const summary = summaryParts.join('. ') + '.';

    const context: AIContext = {
      userId,
      windowDays: 7,
      summary,
      metrics: { bg, water, weight, bp, insulin, latest }
    };

    // Lưu cache
    contextCache.set(userId, {
      data: context,
      expires: Date.now() + CACHE_TTL
    });

    return context;

  } catch (error) {
    console.error('Error building user context:', error);
    
    // Fallback context khi lỗi
    return {
      userId,
      windowDays: 7,
      summary: 'Không thể tải dữ liệu người dùng. Vui lòng thử lại sau.',
      metrics: {
        bg: [],
        water: [],
        weight: [],
        bp: [],
        insulin: [],
        latest: {}
      }
    };
  }
}

/**
 * Clear cache cho user (dùng khi có log mới)
 */
export function clearUserContextCache(userId: string): void {
  contextCache.delete(userId);
}