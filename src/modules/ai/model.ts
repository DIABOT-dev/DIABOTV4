// src/modules/ai/models.ts
import OpenAI from "openai";

export type Intent =
  | "coach_checkin"
  | "reminder_reason"
  | "safety_escalation"
  | "classify"
  | "detect_intent";

export function routeModel(intent: Intent): string {
  switch (intent) {
    case "classify":
    case "detect_intent":
      return "gpt-5-nano";
    default:
      return "gpt-5-mini";
  }
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generate(opts: {
  model: string;
  system?: string;
  prompt: string;
  maxTokens?: number;
}) {
  const { model, system, prompt, maxTokens = 160 } = opts;

  // Giữ chi phí thấp & câu ngắn gọn
  const res = await client.chat.completions.create({
    model,
    temperature: 0.2,
    max_tokens: maxTokens,
    messages: [
      ...(system ? [{ role: "system", content: system }] : []),
      { role: "user" as const, content: prompt },
    ],
  });

  const text = res.choices[0]?.message?.content?.trim() || "";
  // usage có thể undefined với một số model
  const usage = res.usage
    ? { prompt_tokens: res.usage.prompt_tokens, completion_tokens: res.usage.completion_tokens, total_tokens: res.usage.total_tokens }
    : undefined;

  return { text, usage };
}
