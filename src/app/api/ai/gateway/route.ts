import { NextRequest, NextResponse } from "next/server";

/**
 * AI Gateway Stub - Placeholder cho AI system
 * 
 * Contract:
 * POST /api/ai/gateway
 * Body: { idempotency_key?, user_id, intent, message }
 * Response: 200 "OK: stub"
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idempotency_key, user_id, intent, message } = body;

    // Basic validation
    if (!user_id || !intent || !message) {
      return NextResponse.json(
        { error: "Missing required fields: user_id, intent, message" },
        { status: 400 }
      );
    }

    // Stub response - sẽ thay bằng AI logic thật sau
    return NextResponse.json(
      { 
        status: "OK: stub",
        received: {
          idempotency_key,
          user_id,
          intent,
          message: message.substring(0, 50) + "..."
        },
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}