import OpenAI from "openai";
import { generateMock } from "./dev/mockModel";

// Updated Intent type for cost optimization
export type Intent =
  | "simple_qa"
  | "meal_tip" 
  | "reminder_reason"
  | "classify_intent"
  | "complex_coaching"
  | "safety_escalation"
  | "coach_checkin" // Keep existing for compatibility
  | "detect_intent"; // Keep existing for compatibility

// Renamed from routeModel
export function routeModelForIntent(intent: Intent): string {
  switch (intent) {
    case "complex_coaching":
    case "safety_escalation":
      return process.env.MODEL_MINI || "gpt-5-mini";
    default:
      return process.env.MODEL_NANO || "gpt-5-nano";
  }
}

export function maxTokensForIntent(intent: Intent): number {
  switch (intent) {
    case "safety_escalation":
      return 120;
    case "complex_coaching":
      return 100;
    default:
      return 60;
  }
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Renamed from generate
export async function callLLM(opts: {
  model: string;
  system?: string;
  prompt: string;
  maxTokens?: number;
  disableRetry?: boolean;
}) {
  const { model, system, prompt, maxTokens = 160, disableRetry = false } = opts;

  // Mock mode để QA 0 token
  if (process.env.LLM_TRANSPORT === "mock") {
    // Adapt generateMock to handle new intents
    const mockIntent = prompt.includes("safety") || prompt.includes("nguy hiểm") ? "safety_escalation" : "coach_checkin";
    return generateMock({ intent: mockIntent as any, ctx: {} as any, message: prompt });
  }

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    ...(system ? [{ role: "system" as const, content: system }] : []),
    { role: "user" as const, content: prompt },
  ];

  let res;
  try {
    res = await client.chat.completions.create({
      model,
      temperature: 0.2,
      max_tokens: maxTokens,
      messages,
    });
  } catch (error) {
    if (disableRetry) {
      throw error;
    }
    // Basic retry logic
    console.warn("LLM call failed, retrying...", error);
    await new Promise(resolve => setTimeout(resolve, 1000));
    res = await client.chat.completions.create({
      model,
      temperature: 0.2,
      max_tokens: maxTokens,
      messages,
    });
  }

  const text = res.choices[0]?.message?.content?.trim() || "";
  const usage = res.usage
    ? {
        prompt_tokens: res.usage.prompt_tokens,
        completion_tokens: res.usage.completion_tokens,
        total_tokens: res.usage.total_tokens,
      }
    : undefined;

  return { text, usage };
}