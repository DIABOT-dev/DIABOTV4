import { NextRequest } from "next/server";

/** DEV: chỉ lấy từ header; PROD: mới đọc Supabase (import động) */
export function getUserId(req?: NextRequest): string | null {
  if (process.env.AUTH_DEV_MODE === "true") {
    return req?.headers.get("x-debug-user-id") ?? null;
  }
  try {
    // TODO: Implement real auth in production
    return null;
  } catch {
    return null;
  }
}

/** Require authentication - throw if not authenticated */
export async function requireAuth(req?: NextRequest): Promise<string> {
  const userId = getUserId(req);
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
}

/** Require authentication - throw if not authenticated */
export async function requireAuth(req?: NextRequest): Promise<string> {
  const userId = getUserId(req);
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
}