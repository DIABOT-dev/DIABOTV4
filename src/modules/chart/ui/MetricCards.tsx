import React from "react";
import { KPI } from "../domain/types";

export default function MetricCards({ kpi }: { kpi: KPI }) {
  const Card = ({ title, value, sub }: { title: string; value?: string | number; sub?: string }) => (
    <div className="rounded-2xl border p-4 min-w-[140px]" style={{ borderColor: "var(--surface-border,#e5e7eb)" }}>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-semibold mt-1">{value ?? "—"}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card title="BG avg (7d)" value={kpi.bg_avg_7d?.toFixed(0)} sub={kpi.bg_days_above_target_pct!=null?`>target ${kpi.bg_days_above_target_pct}%`:undefined} />
      <Card title="BP avg (7d)" value={kpi.bp_sys_avg_7d && kpi.bp_dia_avg_7d ? `${kpi.bp_sys_avg_7d.toFixed(0)}/${kpi.bp_dia_avg_7d.toFixed(0)}` : "—"} />
      <Card title="Weight" value={kpi.weight_current?.toFixed(1)} sub={kpi.weight_delta_7d!=null?`${kpi.weight_delta_7d>0?"+":""}${kpi.weight_delta_7d} kg vs 7d`:undefined} />
      <Card title="Water avg/day" value={kpi.water_ml_avg_7d?.toFixed(0)} sub="ml" />
      <Card title="Insulin (7d)" value={kpi.insulin_units_sum_7d?.toFixed(0)} sub="units" />
      <Card title="Meal avg/day" value={kpi.meal_count_avg_7d?.toFixed(1)} />
    </div>
  );
}
