import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/db";
import { getUserId } from "@/src/lib/auth/getUserId";
import { addDays } from "date-fns";

function startFromRange(range: string) {
  const now = new Date();
  if (range === "30d") return addDays(now, -30);
  return addDays(now, -7);
}

export async function GET(req: NextRequest, { params }: { params: { metric: string }}) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const metric = params.metric; // e.g. 'bg_avg'
  const url = new URL(req.url);
  const range = url.searchParams.get("range") ?? "7d";
  const since = startFromRange(range).toISOString().slice(0,10); // YYYY-MM-DD

  const sb = supabaseAdmin();

  // Try Chart DB first
  const { data, error } = await sb
    .from("metrics_day")
    .select("day, value")
    .eq("user_id", userId)
    .eq("metric", metric)
    .gte("day", since)
    .order("day", { ascending: true });

  if (!error && data && data.length > 0) {
    return NextResponse.json({ metric, range, points: data.map(d => ({ day: d.day, value: d.value })) });
  }

  // Fallback compute quickly for 'bg_avg' from raw logs
  if (metric === "bg_avg") {
    const { data: logs, error: e2 } = await sb
      .from("glucose_logs")
      .select("taken_at, value_mgdl")
      .eq("user_id", userId)
      .gte("taken_at", since);

    if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

    const map = new Map<string, { sum: number; n: number }>();
    for (const r of logs ?? []) {
      const day = new Date(r.taken_at).toISOString().slice(0,10);
      const cur = map.get(day) ?? { sum: 0, n: 0 };
      cur.sum += r.value_mgdl; cur.n += 1;
      map.set(day, cur);
    }
    const points = [...map.entries()].sort(([a],[b]) => a.localeCompare(b))
      .map(([day, {sum, n}]) => ({ day, value: { avg: Math.round(sum / Math.max(n,1)) } }));

    return NextResponse.json({ metric, range, points });
  }

  return NextResponse.json({ metric, range, points: [] });
}