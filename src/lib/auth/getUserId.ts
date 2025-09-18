import { NextRequest } from "next/server";

/** DEV: chỉ lấy từ header; PROD: mới đọc Supabase (import động) */
export async function getUserId(req?: NextRequest): Promise<string | null> {
  if (process.env.AUTH_DEV_MODE === "true") {
    return req?.headers.get("x-debug-user-id") ?? null;
  }
  try {
    const { createSupabaseServerClient } = await import("./serverClient");
    const sb = createSupabaseServerClient();
    const { data: { user } } = await sb.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}