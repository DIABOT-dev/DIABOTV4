// src/app/api/log/meal/route.ts
import { NextResponse } from "next/server";
import { SaveMealLog } from "../../../../modules/meal/application/usecases/SaveMealLog";
import { SaveMealLogDTO } from "../../../../modules/meal/domain/types";

export async function POST(request: Request) {
  try {
    const body = await request.json() as SaveMealLogDTO & { userId?: string };
    const userId = body.userId ?? (process.env.DEMO_PROFILE_ID || "demo-user-1");
    const saved = await SaveMealLog({
      meal_type: body.meal_type,
      text: body.text,
      portion: body.portion,
      ts: body.ts,
    }, userId);
    return NextResponse.json({ ok: true, data: saved }, { status: 201 });
  } catch (err:any) {
    console.error(err);
    return NextResponse.json({ ok:false, error: err.message || "unknown" }, { status: 400 });
  }
}
