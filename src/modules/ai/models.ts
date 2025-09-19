import OpenAI from "openai";
import { generateMock } from "./dev/mockModel";
import type { AIContext } from "./types";

export type Intent =
  | "greeting"
  | "question"
  | "request"
  | "complaint"
  | "compliment"
  | "goodbye"
  | "other";

export function classifyIntent(message: string): Intent {
  const lower = message.toLowerCase();
  
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "greeting";
  }
  
  if (lower.includes("?") || lower.startsWith("what") || lower.startsWith("how") || lower.startsWith("why")) {
    return "question";
  }
  
  if (lower.includes("please") || lower.includes("can you") || lower.includes("could you")) {
    return "request";
  }
  
  if (lower.includes("problem") || lower.includes("issue") || lower.includes("wrong")) {
    return "complaint";
  }
  
  if (lower.includes("thank") || lower.includes("great") || lower.includes("awesome")) {
    return "compliment";
  }
  
  if (lower.includes("bye") || lower.includes("goodbye") || lower.includes("see you")) {
    return "goodbye";
  }
  
  return "other";
}

const client = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generate(opts: {
  model: string;
  system?: string;
  prompt: string;
  maxTokens?: number;
  intent?: Intent;
  context?: AIContext;
  message?: string;
}) {
  const { model, system, prompt, maxTokens = 120, intent, context, message } = opts;

  // Check if using mock transport
  if (process.env.LLM_TRANSPORT === 'mock' && intent && context) {
    return await generateMock({ intent, ctx: context, message });
  }

  // Require OpenAI client for real calls
  if (!client) {
    throw new Error('OpenAI client not configured. Set OPENAI_API_KEY or use LLM_TRANSPORT=mock');
  }

  // Giữ chi phí thấp & câu ngắn gọn
  const res = await client.chat.completions.create({
    model,
    temperature: 0.2,
    max_tokens: maxTokens,
    messages: [
      ...(system ? [{ role: "system", content: system }] : []),
      { role: "user", content: prompt },
    ],
  });

  const text = res.choices[0]?.message?.content?.trim() || "";
  // usage có thể undefined với một số model
  const usage = res.usage
    ? { prompt_tokens: res.usage.prompt_tokens, completion_tokens: res.usage.completion_tokens, total_tokens: res.usage.total_tokens }
    : undefined;

  return { text, usage };
}