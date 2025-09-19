"use client";

import React, { useMemo, useState } from "react";
import type { BGLogDTO, BGContext, BGUnit } from "@/modules/bg/domain/types";
import { validateBG } from "@/modules/bg/domain/validators";
import { SaveBGLog } from "@/modules/bg/application/usecases/SaveBGLog";
import { BGRepoSupabase } from "@/modules/bg/infrastructure/adapters/BGRepo.supabase";

export function BGForm() {
  // UI state
  const [value, setValue] = useState<string>("");
  const [unit, setUnit] = useState<BGUnit>("mmol/L"); // mặc định mmol/L
  const [context, setContext] = useState<BGContext>("before");
  const [takenAt, setTakenAt] = useState<string>(""); // ISO string hoặc rỗng
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // repo + usecase (khởi tạo 1 lần)
  const saveBG = useMemo(() => {
    const repo = new BGRepoSupabase();
    return new SaveBGLog(repo);
  }, []);

  const setNow = () => {
    const iso = new Date().toISOString().slice(0, 16); // yyyy-mm-ddThh:mm
    setTakenAt(iso);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    const num = Number(value);
    const dto: BGLogDTO = {
      value: isNaN(num) ? 0 : num,
      unit,
      context,
      taken_at: takenAt ? new Date(takenAt).toISOString() : new Date().toISOString(),
    };

    // VALIDATE ở domain — KHÔNG render object {valid} ra UI để tránh lỗi React child
    const result = validateBG(dto);
    if (!result.valid) {
      // ghép chuỗi lỗi ngắn gọn cho người dùng
      const msg =
        ((result as any).errors && (result as any).errors.join(", ")) ||
        ((result as any).message) ||
        "Dữ liệu chưa hợp lệ. Vui lòng kiểm tra lại.";
      setToast(msg);
      return;
    }

    setSubmitting(true);
    try {
      const res = await saveBG.execute(dto);
      if (res.ok) {
        setToast("Lưu thành công.");
        // reset đơn giản (tuỳ bạn có muốn giữ time hay không)
        setValue("");
      } else {
        setToast(res.error || "Không thể lưu. Thử lại.");
      }
    } catch (err: any) {
      setToast(err?.message || "Có lỗi xảy ra khi lưu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <form onSubmit={handleSubmit} className="space-y-[var(--sp-4)]">
        {/* Giá trị */}
        <div>
          <label className="block mb-[var(--sp-2)] font-medium">Giá trị</label>
          <div className="flex gap-[var(--sp-2)]">
            <input
              inputMode="decimal"
              step="0.1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="VD: 5.5"
              className="flex-1 border rounded-xl px-4 h-12"
            />
            {/* Unit toggle */}
            <div className="flex rounded-xl overflow-hidden border">
              <button
                type="button"
                onClick={() => setUnit("mmol/L")}
                className={`px-4 h-12 text-sm ${
                  unit === "mmol/L"
                    ? "bg-[var(--color-primary-700)] text-white"
                    : "bg-white"
                }`}
              >
                mmol/L
              </button>
              <button
                type="button"
                onClick={() => setUnit("mg/dL")}
                className={`px-4 h-12 text-sm ${
                  unit === "mg/dL"
                    ? "bg-[var(--color-primary-700)] text-white"
                    : "bg-white"
                }`}
              >
                mg/dL
              </button>
            </div>
          </div>
          <p className="mt-[var(--sp-2)] text-sm text-black/60">
            Đơn vị mặc định là <strong>mmol/L</strong>. Nếu nhập theo{" "}
            <strong>mg/dL</strong>, chọn lại ở bộ chuyển.
          </p>
        </div>

        {/* Ngữ cảnh */}
        <div>
          <label className="block mb-[var(--sp-2)] font-medium">Ngữ cảnh</label>
          <div className="flex gap-[var(--sp-2)]">
            {[
              { key: "before", label: "Trước ăn" },
              { key: "after2h", label: "Sau ăn 2h" },
              { key: "random", label: "Ngẫu nhiên" },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setContext(opt.key as BGContext)}
                className={`px-4 h-12 rounded-xl border ${
                  context === (opt.key as BGContext)
                    ? "bg-[var(--color-primary-600)] text-white"
                    : "bg-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Thời gian */}
        <div>
          <label className="block mb-[var(--sp-2)] font-medium">Thời gian</label>
          <div className="flex gap-[var(--sp-2)]">
            <input
              type="datetime-local"
              value={takenAt}
              onChange={(e) => setTakenAt(e.target.value)}
              className="flex-1 border rounded-xl px-4 h-12"
            />
            <button
              type="button"
              onClick={setNow}
              className="px-4 h-12 rounded-xl border"
            >
              Bây giờ
            </button>
          </div>
          <p className="mt-[var(--sp-2)] text-sm text-black/60">
            Không chọn sẽ tự lấy thời điểm bấm “Lưu”.
          </p>
        </div>

        {/* Submit */}
        <div className="pt-[var(--sp-2)]">
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-14 rounded-2xl font-bold text-white bg-[var(--color-primary-700)] disabled:opacity-60"
          >
            {submitting ? "Đang lưu…" : "Lưu"}
          </button>
        </div>

        {/* Toast đơn giản (chỉ hiển thị chuỗi, KHÔNG render object) */}
        {toast && (
          <div
            role="status"
            className="text-sm mt-[var(--sp-2)] text-black/80"
          >
            {toast}
          </div>
        )}
      </form>
    </section>
  );
}
