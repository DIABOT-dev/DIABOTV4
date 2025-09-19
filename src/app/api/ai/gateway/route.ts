// src/app/api/ai/gateway/route.ts
import { NextResponse } from "next/server";
import { buildContext } from "@/modules/ai/context";
import { coach_checkin, reminder_reason } from "@/modules/ai/prompt";
import { validateSafety } from "@/modules/ai/guardrails";
import { routeModel, generate } from "@/modules/ai/models";
import { checkIdempotent, saveIdempotent } from "@/ai/utils/idempotency";
import type { Intent } from "@/modules/ai/types";

type GatewayBody = {
  user_id: string;
  intent: Intent;
  message?: string;
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

    // 1) Idempotency check
    const prev = checkIdempotent(idempKey);
    if (prev) {
      return NextResponse.json(prev);
    }

    // 2) Build context (5' cache)
    const ctx = await buildContext(body.user_id);

    // 3) Safety check
    const safety = validateSafety(ctx, body.message || "");
    if (safety.escalate) {
      const response = {
        request_id: crypto.randomUUID(),
        ts: Date.now(),
        model: "safety",
        tokens: 0,
        output: safety.text,
        safety: "high",
        idempotency_key: idempKey || null,
      };

      if (idempKey) saveIdempotent(idempKey, response);
      return NextResponse.json(response);
    }

    // 4) Route model & prompt
    const model = routeModel(body.intent);
    let prompt: string;

    switch (body.intent) {
      case "reminder_reason":
        prompt = reminder_reason(ctx, body.message || "");
        break;
      case "coach_checkin":
      default:
        prompt = coach_checkin(ctx);
        break;
    }

    // 5) Generate response (intent/context/message đã bỏ)
    const result = await generate({
      model,
      prompt,
      maxTokens: 120,
      system:
        "Bạn là trợ lý hỗ trợ thói quen an toàn cho người dùng tiểu đường. " +
        "Tuyệt đối KHÔNG chẩn đoán, KHÔNG đưa liều thuốc, KHÔNG thay thế lời khuyên y tế.",
    });

    const response = {
      request_id: crypto.randomUUID(),
      ts: Date.now(),
      model,
      tokens: result.usage?.total_tokens || 0,
      output: result.text,
      safety: "low",
      idempotency_key: idempKey || null,
    };

    // 6) Save idempotency
    if (idempKey) saveIdempotent(idempKey, response);

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("[AI Gateway Error]", err?.message || "unknown");
    return NextResponse.json(
      { error: "InternalError", message: "internal" },
      { status: 500 }
    );
  }
}
