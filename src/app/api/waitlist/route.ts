import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiter: 3 requests per minute per IP
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60_000;
const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Try again in a minute." },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const sanitized = email.trim().toLowerCase().slice(0, 254);
    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.WAITLIST_NOTIFY_EMAIL;

    if (resendKey && notifyEmail) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "TitleScore <onboarding@resend.dev>",
          to: notifyEmail,
          subject: `[TitleScore Waitlist] ${sanitized}`,
          text: `New waitlist signup: ${sanitized}\nTime: ${new Date().toISOString()}`,
        }),
      });
      if (!res.ok) {
        console.error("Resend failed:", res.status, await res.text().catch(() => ""));
      }
    }

    console.log(`[waitlist] ${sanitized}`);
    return NextResponse.json({ message: "You're on the list!" });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Failed to join waitlist" },
      { status: 500 }
    );
  }
}
