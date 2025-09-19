import OpenAI from "openai";
import { generateMock } from "./dev/mockModel";
import { Intent } from "./types";

export function routeModel(intent: Intent) {
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

  // Nếu mock thì trả kết quả ảo, không gọi OpenAI
  if (process.env.LLM_TRANSPORT === "mock") {
    return generateMock({ intent: "coach_checkin", ctx: {} as any, message: prompt });
  }

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    ...(system ? [{ role: "system" as const, content: system }] : []),
    { role: "user" as const, content: prompt },
  ];

  const res = await client.chat.completions.create({
    model,
    temperature: 0.2,
    max_tokens: maxTokens,
    messages,
  });

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
