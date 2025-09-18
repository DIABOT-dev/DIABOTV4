import { ChartVM, Metric, RangeOption } from "../../domain/types";
import { ChartRepoSupabase } from "../../infrastructure/adapters/ChartRepo.supabase";
import { buildDemoChartVM } from "../../infrastructure/adapters/DemoData";

const repo = new ChartRepoSupabase();
const USE_DEMO = String(process.env.NEXT_PUBLIC_CHART_USE_DEMO || "false") === "true";

export async function FetchChartData(range: RangeOption, metrics?: Metric[]): Promise<ChartVM> {
  if (USE_DEMO) return buildDemoChartVM(range);
  try {
    const vm = await repo.fetchMetricsDay(range, metrics);
    if (!vm?.days?.length) return buildDemoChartVM(range); // DB trống → demo
    return vm;
  } catch {
    return buildDemoChartVM(range); // lỗi fetch → demo
  }
}
