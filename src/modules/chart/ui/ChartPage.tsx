"use client";
import React from "react";
import { FetchChartData } from "../application/usecases/FetchChartData";
import { ChartVM, Metric, RangeOption } from "../domain/types";
import { track } from "../infrastructure/adapters/Telemetry";
import MetricCards from "./MetricCards";
import TrendChart from "./TrendChart";
import LogTimeline from "./LogTimeline";
import { Segmented } from "./components/ToggleGroup";
import { Skeleton } from "./components/Skeleton";

const metricOptions: { label: string; value: Metric | "All" }[] = [
  { label: "All", value: "All" },
  { label: "BG", value: "BG" },
  { label: "BP", value: "BP" },
  { label: "Weight", value: "Weight" },
  { label: "Water", value: "Water" },
  { label: "Insulin", value: "Insulin" },
  { label: "Meal", value: "Meal" },
];

export default function ChartPage() {
  const [range, setRange] = React.useState<RangeOption>("7d");
  const [focus, setFocus] = React.useState<Metric | "All">("All");
  const [vm, setVM] = React.useState<ChartVM | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    track("chart_open", { ts: Date.now() });
  }, []);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true); setError(null);
    FetchChartData(range)
      .then((data) => { if (mounted) setVM(data); })
      .catch((e) => { setError(e?.message || "Load error"); track("chart_error", { message: e?.message }); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [range]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Segmented
          ariaLabel="Chọn khoảng thời gian"
          value={range}
          onChange={(v) => { setRange(v); track("chart_toggle_range", { range: v }); }}
          options={[{label:"7 ngày", value:"7d"}, {label:"30 ngày", value:"30d"}] as any}
        />
        <Segmented
          ariaLabel="Chọn metric"
          value={focus}
          onChange={(v) => { setFocus(v); track("chart_filter_change", { metric: v }); }}
          options={metricOptions as any}
        />
      </div>

      {loading && <Skeleton className="h-24" />}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {vm && <MetricCards kpi={vm.kpi} />}

      {loading && <Skeleton className="h-72" />}
      {vm && <TrendChart vm={vm} focus={focus} />}

      {vm && <LogTimeline range={range} metrics={focus==="All"? undefined : [focus as Metric]} />}
    </div>
  );
}
