import { NextResponse } from "next/server";

// Reserved for a future server deployment. GitHub Pages only serves the static preview.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { planId?: string };
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET)
    return NextResponse.json({
      mode: "demo",
      orderId: `DEMO-${Date.now()}`,
      planId: body.planId ?? "starter",
      message: "Sandbox credentials are not configured; no payment was created.",
    });
  return NextResponse.json(
    {
      mode: "sandbox",
      error:
        "Provider adapter is ready; exchange credentials server-side before enabling order creation.",
    },
    { status: 501 },
  );
}
