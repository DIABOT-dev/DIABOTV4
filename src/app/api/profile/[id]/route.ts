import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { getUserId } from "@/lib/auth/getUserId";

export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  const uid = getUserId(req);
  if (!uid || uid !== params.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sb = supabaseAdmin;
  const { data, error } = await sb.from("profiles").select("*").eq("id", uid).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string }}) {
  const uid = getUserId(req);
  if (!uid || uid !== params.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const payload = await req.json();
  const sb = supabaseAdmin;
  const { data, error } = await sb.from("profiles").update(payload).eq("id", uid).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}