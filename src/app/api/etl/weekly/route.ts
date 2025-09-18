import { NextResponse } from "next/server";
export const runtime = "edge";

export async function POST() {
  try {
    // TODO: aggregate last 7 days, upsert into metrics_week
    return NextResponse.json({ ok: true });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
