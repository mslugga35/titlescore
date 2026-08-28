/**
 * CF Pages Function: POST /api/waitlist
 * Captures email signups, sends notification via Resend.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60_000;
const rateMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  if (rateMap.size > 1000) {
    for (const [key, entry] of rateMap) {
      if (now > entry.resetAt) rateMap.delete(key);
    }
  }
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function onRequestPost(context) {
  try {
    const ip = context.request.headers.get("cf-connecting-ip") ||
      context.request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    if (isRateLimited(ip)) {
      return Response.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
    }

    const { email } = await context.request.json();

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return Response.json({ error: "Valid email required" }, { status: 400 });
    }

    const sanitized = email.trim().toLowerCase().slice(0, 254);
    const resendKey = context.env.RESEND_API_KEY;
    const notifyEmail = context.env.WAITLIST_NOTIFY_EMAIL;

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
        console.error("Resend failed:", res.status);
      }
    }

    console.log("[waitlist] new signup recorded");
    return Response.json({ message: "You're on the list!" });
  } catch (error) {
    console.error("Waitlist error:", error);
    return Response.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}
