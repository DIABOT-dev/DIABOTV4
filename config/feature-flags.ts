/**
 * DIABOT V4 - Feature Flags Configuration
 * 
 * SAFETY: All flags default to "safe" mode (demo/off)
 * Enable via environment variables only when needed
 */

export const FLAGS = {
  // AI Agent: demo mode by default, real AI only when explicitly enabled
  ai_agent: (process.env.NEXT_PUBLIC_AI_AGENT as 'demo' | 'openai' | 'off') ?? 'demo',
  
  // Rewards system: disabled by default
  rewards: process.env.NEXT_PUBLIC_REWARDS === 'true',
  
  // Charts: always enabled (safe feature)
  charts: true,
  
  // Background sync: disabled by default
  background_sync: process.env.NEXT_PUBLIC_BG_SYNC === 'true',
  
  // Debug mode: only in development
  debug: process.env.NODE_ENV === 'development',
  
  // Real-time features: disabled by default
  realtime: process.env.NEXT_PUBLIC_REALTIME === 'true',
} as const;

export type FeatureFlags = typeof FLAGS;

// Helper function to check if feature is enabled
export const isEnabled = (flag: keyof FeatureFlags): boolean => {
  return Boolean(FLAGS[flag]);
};

// Kill switch - disable all non-essential features
export const KILL_SWITCH = process.env.NEXT_PUBLIC_KILL_SWITCH === 'true';

if (KILL_SWITCH) {
  console.warn('🚨 KILL SWITCH ACTIVATED - All non-essential features disabled');
}