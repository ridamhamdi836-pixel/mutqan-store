import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    return NextResponse.json({
      order: {},
      message_ar: action === "accept" ? "تم إضافة العرض لطلبك بنجاح!" : "تم تجاوز العرض.",
    });
  } catch {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message_ar: "حدث خطأ." } },
      { status: 500 }
    );
  }
}
