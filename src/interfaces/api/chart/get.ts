import { NextResponse } from "next/server";
import { GetChartMetric } from "@/application/usecases/GetChartMetric";
import { MetricsRepo } from "@/infrastructure/repositories/MetricsRepo";
import { GlucoseLogsRepo } from "@/infrastructure/repositories/GlucoseLogsRepo";
import { ChartQueryInput } from "@/interfaces/api/validators";
import { getUserId } from "@/lib/auth/getUserId";

export async function handleGet(req: Request, metric: string) {
  try {
    const url = new URL(req.url);
    const range = url.searchParams.get("range") || "7d";
    const userIdParam = url.searchParams.get("userId");
    
    // Get user ID from auth or parameter (for demo)
    let userId = await getUserId();
    if (!userId && userIdParam) {
      userId = userIdParam; // Fallback for demo
    }
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
}

    const query = ChartQueryInput.parse({ metric, range, userId });
    
    const uc = new GetChartMetric(new MetricsRepo(), new GlucoseLogsRepo());
    const result = await uc.execute(userId, metric, query.range);
    
    return NextResponse.json({
      metric,
      range: query.range,
      points: result.labels.map((label, i) => ({
        day: label,
        value: result.series[i]
      }))
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error getting chart data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get chart data' },
      { status: 400 }
    );
  }