"use client";
import React from "react";
// ❌ Sai: "../../../modules/chart/ui/ChartPage"
// ✅ Đúng:
import ChartPage from "../../modules/chart/ui/ChartPage";

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto max-w-screen-sm px-4 h-14 flex items-center gap-3">
          <a href="/" aria-label="Quay lại" className="inline-flex items-center justify-center w-9 h-9 rounded-full border hover:bg-gray-50">←</a>
          <h1 className="text-lg font-semibold">Biểu đồ tổng hợp</h1>
        </div>
      </header>
      <section className="mx-auto max-w-screen-sm px-4 py-4">
        <ChartPage />
      </section>
    </main>
  );
}
