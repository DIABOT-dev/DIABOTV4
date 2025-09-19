// src/ai/utils/cache.ts
// Cache ngắn hạn cho prompt+vars giống hệt (in-memory)

type CacheItem = { ts: number; val: any };
const mem = new Map<string, CacheItem>();

export function makeKey(obj: any): string {
  return JSON.stringify(obj);
}

export function getCache(key: string, ttlSec: number): any | null {
  const hit = mem.get(key);
  if (!hit) return null;
  if (Date.now() - hit.ts > ttlSec * 1000) {
    mem.delete(key);
    return null;
  }
  return hit.val;
}

export function setCache(key: string, val: any) {
  mem.set(key, { ts: Date.now(), val });
}
