// src/app/api/ai/gateway/route.ts
import { NextResponse } from "next/server";
import { buildContext } from "@/modules/ai/context";
import { renderPrompt, guardrails } from "@/modules/ai/prompt";
import { routeIntent } from "@/ai/router/RouterPolicy";
import { checkIdempotent, saveIdempotent } from "@/ai/utils/idempotency";
import { makeKey, getCache, setCache } from "@/ai/utils/cache";
import { generateWithOpenAI } from "@/ai/providers/OpenAIProvider";
import { logAI } from "@/ai/observability/logger";

type GatewayBody = {
  user_id: string;
  intent: string;
  message?: string;
  vars?: Record<string, any>;
};

function safeJsonParse(text: string) {
  try { 
    return { ok: true as const, data: JSON.parse(text) }; 
  } catch (e: any) { 
    return { ok: false as const, error: e?.message || "invalid_json" }; 
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, status: "healthy" });
}

export async function POST(req: Request) {
  const t0 = Date.now();
  let cacheHit = false;
  let idempHit = false;

  try {
    const idempKey = req.headers.get("Idempotency-Key") || "";
    const raw = await req.text();
    if (!raw) {
      return NextResponse.json(
        { error: "Bad Request", message: "empty body" },
        { status: 400 }
      );
    }

    const parsed = safeJsonParse(raw);
    if (!parsed.ok) {
      return NextResponse.json(
        { error: "Bad Request", message: "invalid JSON" },
        { status: 400 }
      );
    }

    const body = parsed.data as GatewayBody;

    if (!body?.user_id || !body?.intent) {
      return NextResponse.json(
        { error: "Bad Request", message: "user_id and intent are required" },
        { status: 400 }
      );
    }

    // 1) Idempotency
    const prev = checkIdempotent(idempKey);
    if (prev) {
      idempHit = true;
      return NextResponse.json(prev);
    }

    // 2) Routing
    const decision = routeIntent(body.intent as any);

    // 3) Context (5’ cache trong context.ts)
    const ctx = await buildContext(body.user_id);

    // 4) Cache theo input thô + model (TRƯỚC khi renderPrompt cho rẻ)
    const cacheKey = makeKey({
      intent: body.intent,
      message: body.message ?? "",
      vars: body.vars ?? {},
      model: decision.model,
      user_id: body.user_id, // tách cache theo user cho chắc
    });
    const cached = getCache(cacheKey, decision.cacheTtlSec);
    if (cached) {
      cacheHit = true;
      return NextResponse.json(cached);
    }

    // 5) Render prompt
    const prompt: string = renderPrompt(body.intent, {
      message: body.message || "",
      context_json: ctx,
      ...body.vars,
    });

    // 6) Gọi model thật nếu không bật STUB
    const useStub = process.env.USE_STUB === "1" || !process.env.OPENAI_API_KEY;
    const modelOutput = useStub
      ? `[${decision.model}] ${prompt.slice(0, 180)}…`
      : await generateWithOpenAI({
          model: decision.model,
          temperature: decision.temperature,
          prompt,
        });

    // 7) Guardrails
    const safety = guardrails(modelOutput);

    const response = {
      request_id: crypto.randomUUID(),
      ts: Date.now(),
      model: decision.model,
      tokens: 0, // (tuỳ bạn tính nếu dùng SDK)
      output: modelOutput,
      safety,
      idempotency_key: idempKey || null,
    };

    // 8) Save cache & idempotency
    if (decision.cacheTtlSec > 0) setCache(cacheKey, response);
    if (idempKey) saveIdempotent(idempKey, response);

    // 9) Log
    logAI({
      ts: t0,
      user_id: body.user_id,
      intent: body.intent,
      model: decision.model,
      latency_ms: Date.now() - t0,
      cache_hit: cacheHit,
      idempotency_hit: idempHit,
    });

    return NextResponse.json(response);
  } catch (err: any) {
    // Log server-side, sanitize client response
    console.error("[AI Gateway Error]", err?.message || "unknown");
    return NextResponse.json(
      { error: "InternalError", message: "internal" },
      { status: 500 }
    );
  }
}
