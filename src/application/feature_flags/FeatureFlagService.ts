type FlagKey =
  | "AI_GATEWAY_ENABLED"
  | "AI_COACH_ENABLED"
  | "AI_MEAL_ENABLED"
  | "AI_VOICE_ENABLED"
  | "AI_FAMILY_ENABLED"
  | "AI_REWARD_ENABLED"
  | "AI_PERSONALIZATION_DEEP"
  | "AI_MARKETPLACE"
  | "AI_FEDERATED_LEARNING"
  | "AI_GAMIFICATION_DEEP";

const CACHE_TTL_MS = 60_000;
let cache: { at: number; data: Record<string, boolean> } | null = null;

function readEnvBool(k: string, d = false) {
  const v = process.env[k];
  if (v == null) return d;
  return /^(1|true|yes|on)$/i.test(v);
}

export class FeatureFlagService {
  static async getAll(): Promise<Record<FlagKey, boolean>> {
    const now = Date.now();
    if (cache && now - cache.at < CACHE_TTL_MS) return cache.data as any;

    const data = {
      AI_GATEWAY_ENABLED: readEnvBool("AI_GATEWAY_ENABLED", true),
      AI_COACH_ENABLED: readEnvBool("AI_COACH_ENABLED", true),
      AI_MEAL_ENABLED: readEnvBool("AI_MEAL_ENABLED", true),
      AI_VOICE_ENABLED: readEnvBool("AI_VOICE_ENABLED", true),
      AI_FAMILY_ENABLED: readEnvBool("AI_FAMILY_ENABLED", true),
      AI_REWARD_ENABLED: readEnvBool("AI_REWARD_ENABLED", true),
      AI_PERSONALIZATION_DEEP: readEnvBool("AI_PERSONALIZATION_DEEP", false),
      AI_MARKETPLACE: readEnvBool("AI_MARKETPLACE", false),
      AI_FEDERATED_LEARNING: readEnvBool("AI_FEDERATED_LEARNING", false),
      AI_GAMIFICATION_DEEP: readEnvBool("AI_GAMIFICATION_DEEP", false),
    } as Record<FlagKey, boolean>;

    cache = { at: now, data };
    return data;
  }

  static async isEnabled(key: FlagKey) {
    const all = await this.getAll();
    return !!all[key];
  }
}
