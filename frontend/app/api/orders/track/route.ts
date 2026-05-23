import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      message_ar: "يرجى التواصل معنا عبر واتساب لتتبع طلبك.",
      order_number: body.public_order_number,
    });
  } catch {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message_ar: "حدث خطأ." } },
      { status: 500 }
    );
  }
}
