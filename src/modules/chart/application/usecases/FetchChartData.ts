import { ChartVM, Metric, RangeOption } from "../../domain/types";
import { buildDemoChartVM } from "../../infrastructure/adapters/DemoData";

export async function FetchChartData(range: RangeOption, metrics?: Metric[]): Promise<ChartVM> {
  return buildDemoChartVM(range);
}
