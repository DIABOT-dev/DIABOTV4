export type BPLog = {
  user_id?: string;   // optional cho dev mode
  systolic: number;
  diastolic: number;
  pulse?: number | null;
  taken_at: string;   // ISO
};