@@ .. @@
 import OpenAI from "openai";
+import { generateMock } from "./dev/mockModel";
+import type { AIContext } from "./types";

 export type Intent =
@@ .. @@
   }
 }

-const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
+const client = process.env.OPENAI_API_KEY 
+  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
+  : null;

 export async function generate(opts: {
   model: string;
   system?: string;
   prompt: string;
   maxTokens?: number;
+  intent?: Intent;
+  context?: AIContext;
+  message?: string;
 }) {
-  const { model, system, prompt, maxTokens = 160 } = opts;
+  const { model, system, prompt, maxTokens = 120, intent, context, message } = opts;
+
+  // Check if using mock transport
+  if (process.env.LLM_TRANSPORT === 'mock' && intent && context) {
+    return await generateMock({ intent, ctx: context, message });
+  }
+
+  // Require OpenAI client for real calls
+  if (!client) {
+    throw new Error('OpenAI client not configured. Set OPENAI_API_KEY or use LLM_TRANSPORT=mock');
+  }

   // Giữ chi phí thấp & câu ngắn gọn
   const res = await client.chat.completions.create({
     model,
-    temperature: 0.2,
+    temperature: 0.2,
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