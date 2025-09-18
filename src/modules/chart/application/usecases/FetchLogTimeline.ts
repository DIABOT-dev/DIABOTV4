import { Metric, RangeOption, TimelineVM } from "../../domain/types";
import { buildDemoTimelineVM } from "../../infrastructure/adapters/DemoData";

export async function FetchLogTimeline(range: RangeOption, metrics?: Metric[], cursor?: string | null): Promise<TimelineVM> {
  return buildDemoTimelineVM(range);
}
