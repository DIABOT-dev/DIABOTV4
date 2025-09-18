"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SaveWaterLog } from "@/modules/water/application/usecases/SaveWaterLog";

// Nếu chưa có design system, tạm để <div>/<button>. Ở đây mình dùng Button/Card/Toast của bạn.
// Đổi import cho khớp dự án nếu cần.
import Card from "@/interfaces/ui/components/atoms/Card";
import Button from "@/interfaces/ui/components/atoms/Button";
import Toast from "@/interfaces/ui/components/atoms/Toast";

type Kind = "water" | "tea" | "other";

function nowLocalISO() {
  const d = new Date();
  d.setSeconds(0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function WaterForm() {
  const router = useRouter();
  const [amount, setAmount] = React.useState<number>(250);
  const [kind, setKind] = React.useState<Kind | undefined>("water");
  const [takenAtLocal, setTakenAtLocal] = React.useState<string>(nowLocalISO());
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("log_water_open"));
  }, []);

  const onQuick = (v: number) => setAmount(v);
  const step    = (d: number) => setAmount(a => Math.max(0, a + d));

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (loading || amount <= 0) return;
    setLoading(true);
    try {
      await SaveWaterLog({
        amount_ml: amount,
        kind,
        taken_at: new Date(takenAtLocal).toISOString(),
      });
      if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("log_water_submit_success"));
      setToast("Đã ghi log nước thành công");
      setTimeout(() => router.push("/"), 1200);
    } catch (err) {
      if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("log_water_submit_error"));
      setToast("Lưu thất bại, thử lại nhé");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100svh] p-4">
      <Card className="p-4 rounded-2xl shadow-md">
        <h1 className="text-xl font-semibold mb-6">Uống nước</h1>

        {/* Preset 200 | 250 */}
        <p className="text-sm text-muted mb-2">Chọn nhanh lượng đã uống:</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[200, 250].map(v => (
            <Button
              key={v}
              size="lg"
              onClick={() => onQuick(v)}
              disabled={loading}
              className="min-h-[44px] rounded-xl text-[15.5px]"
              style={{
                background: amount===v ? "var(--color-primary-600,#14b8a6)" : "var(--surface-input,#eaf5f7)",
                color:      amount===v ? "#fff" : "var(--text-primary,#0f172a)"
              }}
              aria-pressed={amount===v}
            >
              💧 {v} ml
            </Button>
          ))}
        </div>

        {/* Stepper + input */}
        <div className="flex items-center gap-3 mb-4">
          <Button type="button" size="md" onClick={() => step(-50)} className="min-h-[44px] w-16 rounded-xl">−50</Button>
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Lượng nước (ml)</label>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={amount}
              onChange={(e)=> setAmount(Number(e.target.value || 0))}
              className="w-full h-11 px-3 rounded-xl border"
            />
          </div>
          <Button type="button" size="md" onClick={() => step(+50)} className="min-h-[44px] w-16 rounded-xl">+50</Button>
        </div>

        {/* Kind (optional) */}
        <div className="mb-4">
          <p className="mb-2 font-semibold">Loại</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { k:"water", label:"Nước lọc" },
              { k:"tea",   label:"Trà" },
              { k:"other", label:"Khác" },
            ].map(({k,label})=>(
              <Button
                key={k}
                type="button"
                onClick={()=> setKind(k as Kind)}
                className="min-h-[44px] rounded-xl"
                style={{
                  background: kind===k ? "var(--color-primary-600,#14b8a6)" : "#fff",
                  color:      kind===k ? "#fff" : "var(--text-primary,#0f172a)",
                  border:     kind===k ? "1.5px solid var(--color-primary-700,#0e7490)" : "1.5px solid #e5e7eb"
                }}
                aria-pressed={kind===k}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Time */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Thời gian</label>
          <input
            type="datetime-local"
            value={takenAtLocal}
            max={nowLocalISO()}
            onChange={(e)=> setTakenAtLocal(e.target.value)}
            className="w-full h-11 px-3 rounded-xl border"
          />
        </div>

        {/* Sticky footer submit */}
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={loading || amount<=0}
          className="w-full min-h-[48px] rounded-2xl text-white"
          style={{ background:"var(--color-primary-700,#0e7490)" }}
        >
          {loading ? "Đang lưu…" : "Lưu"}
        </Button>

        <Button variant="ghost" size="md" onClick={()=>router.push("/")} className="w-full mt-4 min-h-[44px] rounded-xl text-[15.5px]">
          ← Quay lại
        </Button>
      </Card>

      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast message={toast} onClose={()=>setToast(null)} />
        </div>
      )}
    </div>
  );
}
