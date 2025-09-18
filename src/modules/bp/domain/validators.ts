import { BPLog } from "./types"

export function validateBP(log: BPLog): string | null {
  if (log.systolic <= 50) return "Systolic phải > 50"
  if (log.diastolic <= 30) return "Diastolic phải > 30"
  if (log.systolic <= log.diastolic) return "Systolic phải > Diastolic"
  if (log.taken_at > new Date()) return "Thời gian không hợp lệ"
  return null
}
