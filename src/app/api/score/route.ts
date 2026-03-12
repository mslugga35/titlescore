import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic();

// Simple in-memory rate limiter: 10 requests per minute per IP
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

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

const MAX_TITLE_LENGTH = 200;
const MAX_NICHE_LENGTH = 100;
const MAX_THUMBNAIL_BYTES = 5 * 1024 * 1024; // 5 MB base64
const ALLOWED_MEDIA_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;
type MediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

const SCORING_PROMPT = `You are a YouTube CTR optimization expert. You've analyzed millions of YouTube videos and understand what makes titles and thumbnails get clicked.

Analyze the following YouTube video title and provide a detailed CTR score and recommendations.

SCORING CRITERIA (each 0-20, total 0-100):
1. **Curiosity Gap** (0-20): Does the title create an irresistible urge to click? Does it tease without revealing?
2. **Emotional Trigger** (0-20): Does it evoke strong emotion (shock, excitement, fear, joy, anger)?
3. **Clarity** (0-20): Is it immediately clear what the video is about? No confusion?
4. **Search/Browse Fit** (0-20): Would this work in YouTube search AND browse/suggested? Good keyword density?
5. **Packaging Power** (0-20): Length optimization (50-60 chars ideal), power words, numbers, formatting?

RESPOND IN THIS EXACT JSON FORMAT (no markdown, just raw JSON):
{
  "total_score": <number 0-100>,
  "grade": "<S/A/B/C/D/F>",
  "curiosity": { "score": <0-20>, "reason": "<1 sentence>" },
  "emotion": { "score": <0-20>, "reason": "<1 sentence>" },
  "clarity": { "score": <0-20>, "reason": "<1 sentence>" },
  "search_browse": { "score": <0-20>, "reason": "<1 sentence>" },
  "packaging": { "score": <0-20>, "reason": "<1 sentence>" },
  "improved_titles": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "key_issue": "<the single biggest thing holding this title back>",
  "quick_fix": "<one specific change that would boost CTR the most>"
}

GRADING SCALE:
- S (90-100): Viral potential. MrBeast-level packaging.
- A (75-89): Strong click magnet. Will outperform most competitors.
- B (60-74): Solid. Above average CTR expected.
- C (45-59): Average. Needs work on 1-2 dimensions.
- D (30-44): Below average. Multiple issues.
- F (0-29): Will get buried. Major rewrite needed.`;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again in a minute." },
        { status: 429 }
      );
    }

    const { title, niche, thumbnail_base64, thumbnail_media_type } = await req.json();

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json({ error: `Title must be under ${MAX_TITLE_LENGTH} characters` }, { status: 400 });
    }
    if (niche && (typeof niche !== "string" || niche.length > MAX_NICHE_LENGTH)) {
      return NextResponse.json({ error: `Niche must be under ${MAX_NICHE_LENGTH} characters` }, { status: 400 });
    }

    const content: Anthropic.ContentBlockParam[] = [];

    if (thumbnail_base64) {
      if (typeof thumbnail_base64 !== "string" || thumbnail_base64.length > MAX_THUMBNAIL_BYTES) {
        return NextResponse.json({ error: "Thumbnail too large (max 5 MB)" }, { status: 400 });
      }
      const mediaType: MediaType = ALLOWED_MEDIA_TYPES.includes(thumbnail_media_type)
        ? thumbnail_media_type
        : "image/png";

      content.push({
        type: "image",
        source: { type: "base64", media_type: mediaType, data: thumbnail_base64 },
      });
      content.push({
        type: "text",
        text: `Analyze this YouTube thumbnail together with the title below. Consider: face visibility, text readability, contrast, emotional expression, composition, mobile-friendliness.\n\nTitle: "${title.trim()}"${niche ? `\nNiche: ${niche.trim()}` : ""}`,
      });
    } else {
      content.push({
        type: "text",
        text: `Title: "${title.trim()}"${niche ? `\nNiche: ${niche.trim()}` : ""}`,
      });
    }

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SCORING_PROMPT,
      messages: [{ role: "user", content }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    let score;
    try {
      score = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        score = JSON.parse(jsonMatch[0]);
      } else {
        console.error("Failed to parse score response:", text);
        return NextResponse.json(
          { error: "Failed to parse score" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      score,
      tokens_used: response.usage.input_tokens + response.usage.output_tokens,
    });
  } catch (error) {
    console.error("Score API error:", error);
    return NextResponse.json(
      { error: "Failed to generate score" },
      { status: 500 }
    );
  }
}
