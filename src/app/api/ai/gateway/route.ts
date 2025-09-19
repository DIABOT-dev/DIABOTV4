// src/app/api/ai/gateway/route.ts
import { NextResponse } from "next/server";
import { buildContext } from "@/modules/ai/context";
import { renderPrompt, guardrails } from "@/modules/ai/prompt";
import { routeIntent } from "@/ai/router/RouterPolicy";
import { checkIdempotent, saveIdempotent } from "@/ai/utils/idempotency";
import { makeKey, getCache, setCache } from "@/ai/utils/cache";

type GatewayBody = {
  user_id: string;
  intent: string;
  message?: string;
  vars?: Record<string, any>;
};

export async function POST(req: Request) {
  try {
    const idempKey = req.headers.get("Idempotency-Key") || "";
    const body = (await req.json()) as GatewayBody;

    if (!body?.user_id || !body?.intent) {
      return NextResponse.json(
        { error: "Bad Request", message: "user_id and intent are required" },
        { status: 400 }
      );
    }

    // check idempotent
    const prev = checkIdempotent(idempKey);
    if (prev) return NextResponse.json(prev);

    // route intent
    const decision = routeIntent(body.intent as any);

    // build context
    const ctx = await buildContext(body.user_id);

    // prompt render
    const prompt: string = renderPrompt(body.intent, {
      message: body.message || "",
      context_json: ctx,
      ...body.vars,
    });

    // cache by prompt
    const cacheKey = makeKey({ intent: body.intent, prompt });
    const cached = getCache(cacheKey, decision.cacheTtlSec);
    if (cached) return NextResponse.json(cached);

    // TODO: gọi model thật (nano/mini). Hiện tại stub.
    const output = `[${decision.model}] ${prompt.slice(0, 120)}…`;

    // guardrails
    const safety = guardrails(output);

    const response = {
      request_id: crypto.randomUUID(),
      ts: Date.now(),
      model: decision.model,
      tokens: 0,
      output,
      safety,
      idempotency_key: idempKey || null,
    };

    // save cache & idempotency
    if (decision.cacheTtlSec > 0) setCache(cacheKey, response);
    if (idempKey) saveIdempotent(idempKey, response);

    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json(
      { error: "InternalError", message: err?.message ?? "unknown" },
      { status: 500 }
    );
  }
}
