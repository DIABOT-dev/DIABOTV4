// src/ai/utils/idempotency.ts
// Lưu cache input/output theo Idempotency-Key (in-memory, 24h)

type Stored = { ts: number; response: any };
const store = new Map<string, Stored>();
const TTL_MS = 24 * 60 * 60 * 1000;

export function checkIdempotent(key?: string): any | null {
  if (!key) return null;
  const hit = store.get(key);
  if (hit && Date.now() - hit.ts < TTL_MS) return hit.response;
  return null;
}

export function saveIdempotent(key: string, response: any) {
  store.set(key, { ts: Date.now(), response });
}
