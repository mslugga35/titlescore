import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const sanitized = email.trim().toLowerCase().slice(0, 254);
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "TitleScore <onboarding@resend.dev>",
          to: "mpm.morales@gmail.com",
          subject: `[TitleScore Waitlist] ${sanitized}`,
          text: `New waitlist signup: ${sanitized}\nTime: ${new Date().toISOString()}`,
        }),
      });
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
