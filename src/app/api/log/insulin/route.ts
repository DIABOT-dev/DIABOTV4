import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db";
import { getUserId } from "@/lib/auth/getUserId";

const bodySchema = z.object({
  dose_units: z.number().min(0.1).max(100),
  type: z.enum(["bolus","basal","mixed","correction"]).optional(),
  taken_at: z.string().datetime().optional(),
});

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parse = bodySchema.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });

  const { dose_units, type, taken_at } = parse.data;
  const taken = taken_at ? new Date(taken_at).toISOString() : new Date().toISOString();

  const sb = supabaseAdmin;
  const { data, error } = await sb
    .from("insulin_logs")
    .insert({ user_id: userId, dose_units, type, taken_at: taken })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data }, { status: 201 });
}