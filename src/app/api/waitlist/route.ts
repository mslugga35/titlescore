import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiter: 3 requests per minute per IP
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60_000;
const rateMap = new Map<string, { count: number; resetAt: number }>();

function getRateLimitInfo(ip: string): {
  isLimited: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { isLimited: false, limit: RATE_LIMIT, remaining: RATE_LIMIT - 1, resetAt: now + RATE_WINDOW_MS };
  }
  entry.count++;
  const remaining = Math.max(0, RATE_LIMIT - entry.count);
  return { isLimited: entry.count > RATE_LIMIT, limit: RATE_LIMIT, remaining, resetAt: entry.resetAt };
}

function addRateLimitHeaders(response: NextResponse, rateLimitInfo: ReturnType<typeof getRateLimitInfo>) {
  response.headers.set("RateLimit-Limit", rateLimitInfo.limit.toString());
  response.headers.set("RateLimit-Remaining", rateLimitInfo.remaining.toString());
  response.headers.set("RateLimit-Reset", Math.ceil(rateLimitInfo.resetAt / 1000).toString());
  return response;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const rateLimitInfo = getRateLimitInfo(ip);
    if (rateLimitInfo.isLimited) {
      const response = NextResponse.json(
        { error: "Too many requests. Try again in a minute." },
        { status: 429 }
      );
      return addRateLimitHeaders(response, rateLimitInfo);
    }

    const { email } = await req.json();

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      const response = NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
      return addRateLimitHeaders(response, rateLimitInfo);
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

    console.log("[waitlist] new signup recorded");
    const response = NextResponse.json({ message: "You're on the list!" });
    return addRateLimitHeaders(response, rateLimitInfo);
  } catch (error) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const rateLimitInfo = getRateLimitInfo(ip);
    console.error("Waitlist error:", error);
    const response = NextResponse.json(
      { error: "Failed to join waitlist" },
      { status: 500 }
    );
    return addRateLimitHeaders(response, rateLimitInfo);
  }
}
