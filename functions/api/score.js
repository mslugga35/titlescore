/**
 * CF Pages Function: POST /api/score
 * Scores a YouTube title (and optional thumbnail) using Claude Haiku.
 */

const MAX_TITLE_LENGTH = 200;
const MAX_NICHE_LENGTH = 100;
const MAX_THUMBNAIL_BYTES = 5 * 1024 * 1024;
const ALLOWED_MEDIA_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const rateMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  // Prune stale entries when map grows large (prevents unbounded memory growth)
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

export async function onRequestPost(context) {
  try {
    const ip = context.request.headers.get("cf-connecting-ip") ||
      context.request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    if (isRateLimited(ip)) {
      return Response.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
    }

    const apiKey = context.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "API not configured" }, { status: 503 });
    }

    const { title, niche, thumbnail_base64, thumbnail_media_type } = await context.request.json();

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }
    if (title.length > MAX_TITLE_LENGTH) {
      return Response.json({ error: `Title must be under ${MAX_TITLE_LENGTH} characters` }, { status: 400 });
    }
    if (niche && (typeof niche !== "string" || niche.length > MAX_NICHE_LENGTH)) {
      return Response.json({ error: `Niche must be under ${MAX_NICHE_LENGTH} characters` }, { status: 400 });
    }

    const content = [];

    if (thumbnail_base64) {
      if (typeof thumbnail_base64 !== "string" || thumbnail_base64.length > MAX_THUMBNAIL_BYTES) {
        return Response.json({ error: "Thumbnail too large (max 5 MB)" }, { status: 400 });
      }
      const mediaType = ALLOWED_MEDIA_TYPES.includes(thumbnail_media_type)
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

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        // Model IDs are complete as-is - never append a date suffix. The
        // date-suffixed "claude-haiku-4-5-20251001" is not a valid model and
        // returned 400 invalid_request_error on every scoring request.
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        system: SCORING_PROMPT,
        messages: [{ role: "user", content }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text().catch(() => "");
      console.error("Anthropic error:", anthropicRes.status, errText);
      // Surface the upstream STATUS and error type - never the body, which can
      // echo request content. Swallowing this into a bare 500 is why a dead
      // upstream key went unnoticed for months: every failure looked identical.
      let upstreamType = "";
      let upstreamMessage = "";
      try {
        const parsed = (JSON.parse(errText).error || {});
        upstreamType = parsed.type || "";
        upstreamMessage = String(parsed.message || "");
      } catch (e) { /* non-JSON */ }

      // A depleted credit balance is an operator problem, not a caller problem.
      // Say so distinctly - this exact failure returned a generic 500 for four
      // months and nobody could tell it from a bad request or a dead key.
      if (/credit balance is too low/i.test(upstreamMessage)) {
        return Response.json({
          error: "Scoring is temporarily unavailable. Please try again later.",
          reason: "upstream_account_credit",
        }, { status: 503 });
      }

      // Status and error type only - never the upstream message, which can
      // carry account or request details a visitor should not see.
      return Response.json({
        error: "Failed to generate score",
        upstream_status: anthropicRes.status,
        upstream_type: upstreamType,
      }, { status: 500 });
    }

    const response = await anthropicRes.json();
    const text = response.content?.[0]?.type === "text" ? response.content[0].text : "";

    let score;
    try {
      score = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        score = JSON.parse(jsonMatch[0]);
      } else {
        console.error("Failed to parse score response:", text);
        return Response.json({ error: "Failed to parse score" }, { status: 500 });
      }
    }

    return Response.json({ score });
  } catch (error) {
    console.error("Score API error:", error);
    return Response.json({ error: "Failed to generate score" }, { status: 500 });
  }
}
