import React from "react";
import { FetchLogTimeline } from "../application/usecases/FetchLogTimeline";
import { Metric, RangeOption, TimelineGroup } from "../domain/types";
import { track } from "../infrastructure/adapters/Telemetry";
import { Skeleton } from "./components/Skeleton";

export default function LogTimeline({ range, metrics }: { range: RangeOption; metrics?: Metric[] }) {
  const [groups, setGroups] = React.useState<TimelineGroup[]>([]);
  const [cursor, setCursor] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    setGroups([]); setCursor(null); setDone(false);
    void loadMore(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, JSON.stringify(metrics||[])])

  async function loadMore(first=false) {
    if (loading || done) return;
    setLoading(true);
    const res = await FetchLogTimeline(range, metrics, first? null : cursor);
    setGroups(prev => mergeGroups(prev, res.groups));
    setCursor(res.nextCursor ?? null);
    setDone(!res.nextCursor);
    setLoading(false);
    track("chart_timeline_load_more", { range, metrics, nextCursor: res.nextCursor });
  }

  return (
    <div className="rounded-2xl border p-3" style={{ borderColor: "var(--surface-border,#e5e7eb)" }}>
      <h3 className="font-semibold mb-2">Nhật ký</h3>
      {groups.length === 0 && loading && <Skeleton className="h-24" />}
      {groups.length === 0 && !loading && <Empty />}
      <div className="space-y-4">
        {groups.map(g => (
          <div key={g.date}>
            <div className="text-sm text-gray-500 mb-1">{g.date}</div>
            <ul className="space-y-2">
              {g.items.map((it, idx) => (
                <li key={idx} className="rounded-xl border p-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{it.title}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(it.ts).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                      {" · "}{String(it.value)}{it.unit?` ${it.unit}`:""}
                      {it.context?` · ${it.context}`:""}
                    </div>
                    {it.note && <div className="text-xs text-gray-500 mt-1">{it.note}</div>}
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{it.type}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {!done && (
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => loadMore(false)}
            className="px-4 h-10 rounded-xl font-medium border hover:bg-gray-50"
          >
            {loading ? "Đang tải..." : "Tải thêm"}
          </button>
        </div>
      )}
    </div>
  );
}

function mergeGroups(prev: TimelineGroup[], next: TimelineGroup[]) {
  const map = new Map<string, any>();
  for (const g of prev) map.set(g.date, g);
  for (const g of next) {
    if (!map.has(g.date)) map.set(g.date, { date: g.date, items: [...g.items] });
    else map.get(g.date).items.push(...g.items);
  }
  return Array.from(map.values()).sort((a,b)=> b.date.localeCompare(a.date));
}

function Empty() {
  return (
    <div className="text-sm text-gray-500">Chưa có dữ liệu trong khoảng đã chọn</div>
  );
}
