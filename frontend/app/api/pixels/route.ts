/**
 * Server-side pixel event proxy (optional).
 * Useful for sending events server-side without exposing tokens to the client.
 * Currently a placeholder - extend with actual CAPI calls if needed.
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward to backend API for CAPI handling
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    
    // This is a passthrough for analytics events that need server-side processing
    // The actual CAPI is handled by the backend order endpoints
    
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
