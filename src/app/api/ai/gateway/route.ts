import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { FeatureFlagService } from "../../../../application/feature_flags/FeatureFlagService";
import { routeModel } from "../../../../application/services/routeModel";
import { buildUserContext } from "../../../../application/services/buildUserContext";



// === Helpers Supabase ===
function supaAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

// === Rate limit + Idempotency (lưu user_kv) ===
async function rateLimit(supa: any, user_id: string) {
  const bucket = "gateway:5s";
  const key = `rate:${bucket}`;
  const now = Date.now();

  // đọc kv
  const { data } = await supa
    .from("user_kv")
    .select("id, value")
    .eq("user_id", user_id)
    .eq("key", key)
    .maybeSingle();

  let count = 0;
  let resetAt = now + 5000;

  if (data?.value) {
    const v = data.value as { resetAt: number; count: number };
    if (now < v.resetAt) {
      count = v.count;
      resetAt = v.resetAt;
    }
  }

  if (now >= resetAt) {
    count = 0;
    resetAt = now + 5000;
  }

  if (count >= 3) {
    return { allowed: false, resetAt };
  }

  // update
  const newVal = { resetAt, count: count + 1 };
  if (data?.id) {
    await supa.from("user_kv").update({ value: newVal }).eq("id", data.id);
  } else {
    await supa.from("user_kv").insert({ user_id, key, value: newVal });
  }

  return { allowed: true, resetAt };
}

async function checkIdempotency(supa: any, user_id: string, idemKey?: string) {
  if (!idemKey) return { hit: false as const, payload: null as any };

  const key = `idem:${idemKey}`;
  const { data } = await supa
    .from("user_kv")
    .select("id, value")
    .eq("user_id", user_id)
    .eq("key", key)
    .maybeSingle();

  if (data?.value) return { hit: true as const, payload: data.value };

  return { hit: false as const, payload: null as any };
}

async function saveIdempotency(supa: any, user_id: string, idemKey?: string, payload?: any) {
  if (!idemKey || !payload) return;
  const key = `idem:${idemKey}`;
  const { data } = await supa
    .from("user_kv")
    .select("id")
    .eq("user_id", user_id)
    .eq("key", key)
    .maybeSingle();

  if (data?.id) {
    await supa.from("user_kv").update({ value: payload }).eq("id", data.id);
  } else {
    await supa.from("user_kv").insert({ user_id, key, value: payload });
  }
}

// === Prompt templates ===
function renderCoachPrompt(ctx: any, intent: string) {
  const bg = ctx.bg_latest
    ? `BG gần nhất: ${ctx.bg_latest.value}${ctx.bg_latest.unit} (${ctx.bg_latest.time_ago}).`
    : `Chưa có BG gần đây.`;
  const w = `Nước hôm nay: ${ctx.water_today_ml ?? 0} ml.`;
  const s = `Streak BG: ${ctx.streaks?.bg_days ?? 0} ngày.`;
  const sys = "Bạn là HLV sức khỏe tiểu đường thân thiện, trả lời ≤2 câu, tiếng Việt chuẩn, có số liệu người dùng.";
  const user = `${bg} ${w} ${s} Nhiệm vụ: ${intent}. → Nhắc ngắn + 1 gợi ý hành động.`;
  return { system: sys, user };
}

function renderMealPrompt(ctx: any) {
  const lm = ctx.last_meal?.brief
    ? `Bữa gần nhất: ${ctx.last_meal.brief}.`
    : "Chưa có bữa gần nhất.";
  const sys =
    "Bạn là chuyên gia dinh dưỡng cho người tiểu đường Việt Nam, ưu tiên món hấp/luộc/ít dầu.";
  const user =
    `${lm} Hãy gợi ý 1 bữa theo "nồi hấp 3 tầng" (tinh bột–đạm–rau), kèm lượng ước tính.`; // ≤1 gợi ý
  return { system: sys, user };
}

// === Stub model call (MVP) ===
async function callModelStub(model: string, moat: string, prompt: { system: string; user: string }, ctx: any) {
  // Trả text ngắn đúng format để QA Postman
  if (moat === "coach") {
    const tip =
      (ctx.bg_latest?.value && ctx.bg_latest.value > 180)
        ? "Uống 300–500ml nước lọc và đi bộ nhẹ 10 phút."
        : "Bổ sung 1 ly nước và vận động nhẹ 5–10 phút.";
    return {
      reply_text: `Nhắc nhẹ: duy trì nhập BG đều và theo dõi nước hôm nay. Gợi ý: ${tip}`,
      usage: { prompt_tokens: 80, completion_tokens: 24, total_tokens: 104 },
    };
  } else if (moat === "meal") {
    return {
      reply_text:
        "Gợi ý: Nồi hấp 3 tầng – T1: 80–100g gạo lứt; T2: 120g ức gà/đậu phụ; T3: 250g rau xanh (cải/broccoli). Ăn chậm, chia 2 phần nếu cần.",
      usage: { prompt_tokens: 90, completion_tokens: 30, total_tokens: 120 },
    };
  }
  return {
    reply_text: "Bot đã nhận yêu cầu. Tính năng sẽ mở trong các phase tiếp theo.",
    usage: { prompt_tokens: 30, completion_tokens: 10, total_tokens: 40 },
  };
}

// === Audit ===
async function writeAudit(supa: any, row: any) {
  await supa.from("ai_audit").insert(row);
}

export async function POST(req: NextRequest) {
  const supa = supaAdmin();

  // Flags
  if (!(await FeatureFlagService.isEnabled("AI_GATEWAY_ENABLED"))) {
    return NextResponse.json({ error: "Gateway disabled" }, { status: 503 });
  }

  const idemKey = req.headers.get("Idempotency-Key") || undefined;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { moat, intent, user_id, input } = body || {};
  if (!moat || !intent || !user_id) {
    return NextResponse.json({ error: "Missing moat|intent|user_id" }, { status: 400 });
  }

  // Check moat flags
  const moatKey = `AI_${String(moat).toUpperCase()}_ENABLED` as any;
  if (!(await FeatureFlagService.isEnabled(moatKey))) {
    return NextResponse.json({ error: `Moat ${moat} disabled` }, { status: 403 });
  }

  // Idempotency
  const idem = await checkIdempotency(supa, user_id, idemKey);
  if (idem.hit) {
    return NextResponse.json({ ...idem.payload, idempotent: true }, { status: 200 });
  }

  // Rate limit
  const rl = await rateLimit(supa, user_id);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too Many Requests", resetAt: rl.resetAt },
      { status: 429 }
    );
  }

  const t0 = Date.now();
  let status = "ok";
  let model = "gpt-5-nano";
  let usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
  let reply_text = "";

  try {
    // Build context
    const ctx = await buildUserContext(user_id);

    // Route model
    model = routeModel(moat, intent);

    // Render prompt
    const prompt =
      moat === "coach" ? renderCoachPrompt(ctx, intent)
      : moat === "meal" ? renderMealPrompt(ctx)
      : { system: "General", user: intent };

    // Stub call (MVP). Sau khi QA xong, sẽ thay bằng call GPT thật.
    const out = await callModelStub(model, moat, prompt, ctx);
    reply_text = out.reply_text;
    usage = out.usage;

    // Audit
    await writeAudit(supa, {
      user_id,
      moat,
      intent,
      model,
      tokens: usage.total_tokens,
      latency_ms: Date.now() - t0,
      status,
    });

    const payload = {
      moat,
      model,
      reply_text,
      meta: { usage, latency_ms: Date.now() - t0, input: input ?? null },
    };

    // Save idempotent
    await saveIdempotency(supa, user_id, idemKey, payload);

    return NextResponse.json(payload, { status: 200 });
  } catch (e: any) {
    status = "error";
    await writeAudit(supa, {
      user_id,
      moat,
      intent,
      model,
      tokens: 0,
      latency_ms: Date.now() - t0,
      status,
    });
    return NextResponse.json({ error: e?.message || "Internal Error" }, { status: 500 });
  }
}
