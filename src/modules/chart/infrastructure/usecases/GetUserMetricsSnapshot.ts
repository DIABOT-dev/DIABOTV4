import { ChartRepo } from "../../infrastructure/adapters/ChartRepo.supabase";
import { SnapshotVM } from "../../domain/types";

// Lấy snapshot KPI hiện tại (ví dụ hiển thị header nhanh)
export async function GetUserMetricsSnapshot(): Promise<SnapshotVM> {
  const result = await ChartRepo.fetchSnapshot();
  return result;
}
