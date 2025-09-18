import React from "react";
import { ChartVM, Metric } from "../domain/types";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, ResponsiveContainer,
} from "recharts";

type Props = { vm: ChartVM; focus: Metric | "All" };

export default function TrendChart({ vm, focus }: Props) {
  const data = vm.days.map(d => ({
    date: d.date,
    BG: d.bg_avg,
    BP_SYS: d.bp_sys_avg,
    BP_DIA: d.bp_dia_avg,
    Weight: d.weight_kg,
    Water: d.water_ml,
    Insulin: d.insulin_units,
    Meal: d.meals_count,
  }));

  if (focus === "BG" || focus === "Weight") {
    return (
      <ChartFrame>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={focus} dot={false} />
        </LineChart>
      </ChartFrame>
    );
  }

  if (focus === "BP") {
    return (
      <ChartFrame>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="BP_SYS" dot={false} />
          <Line type="monotone" dataKey="BP_DIA" dot={false} />
        </LineChart>
      </ChartFrame>
    );
  }

  if (focus === "Water" || focus === "Insulin" || focus === "Meal") {
    return (
      <ChartFrame>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={focus} />
        </BarChart>
      </ChartFrame>
    );
  }

  // All → hiển thị BG + Weight (gọn, dễ đọc). Có thể mở rộng nếu muốn.
  return (
    <ChartFrame>
      <ComposedAll data={data} />
    </ChartFrame>
  );
}

function ChartFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-2" style={{ borderColor: "var(--surface-border,#e5e7eb)" }}>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>{children as any}</ResponsiveContainer>
      </div>
    </div>
  );
}

function ComposedAll({ data }: { data: any[] }) {
  return (
    <>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="BG" dot={false} />
        <Line type="monotone" dataKey="Weight" dot={false} />
      </LineChart>
    </>
  );
}
