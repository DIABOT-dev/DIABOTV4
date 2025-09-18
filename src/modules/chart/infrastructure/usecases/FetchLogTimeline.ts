import { Metric, RangeOption, TimelineVM } from "../../domain/types";
import { ChartRepoSupabase } from "../../infrastructure/adapters/ChartRepo.supabase";
import { buildDemoTimelineVM } from "../../infrastructure/adapters/DemoData";

const repo = new ChartRepoSupabase();
const USE_DEMO = String(process.env.NEXT_PUBLIC_CHART_USE_DEMO || "false") === "true";

export async function FetchLogTimeline(range: RangeOption, metrics?: Metric[], cursor?: string | null): Promise<TimelineVM> {
  if (USE_DEMO) return buildDemoTimelineVM(range);
  try {
    const vm = await repo.fetchTimeline(range, metrics, cursor);
    if (!vm?.groups?.length) return buildDemoTimelineVM(range);
    return vm;
  } catch {
    return buildDemoTimelineVM(range);
  }
}
