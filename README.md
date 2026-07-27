# TitleScore

**AI-powered YouTube title CTR analyzer** — Get instant feedback on your video titles using Claude AI.

[**Live App →**](https://gettitlescore.com)

## What is TitleScore?

TitleScore analyzes YouTube video titles and provides a detailed CTR (click-through rate) score across 5 key dimensions:

1. **Curiosity Gap** — Does it create an irresistible urge to click?
2. **Emotional Trigger** — Does it evoke strong emotion (shock, excitement, fear, joy)?
3. **Clarity** — Is it immediately clear what the video is about?
4. **Search/Browse Fit** — Would this work in search AND suggested videos?
5. **Packaging Power** — Optimal length, power words, numbers, formatting

Each dimension is scored 0-20 (total 0-100), with grades S (90-100), A (75-89), B (60-74), C (45-59), D (30-44), F (0-29).

### Features
- ⚡ **Instant scoring** — Powered by Claude Haiku (fast + cheap)
- 🎯 **AI-generated suggestions** — Get 3 improved title alternatives
- 📊 **Detailed breakdown** — Understand exactly what's working (or not)
- 🖼️ **Optional thumbnail analysis** — Claude can factor in your thumbnail
- 📧 **Waitlist** — Notify users when new features drop

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **AI:** Claude Haiku API (vision-capable)
- **Styling:** Tailwind 4 + custom design system
- **Fonts:** DM Sans (body), JetBrains Mono (monospace)
- **Colors:** Dark mode with blue→indigo→violet gradients
- **Hosting:** Vercel
- **Email:** Resend (waitlist notifications)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Main scoring UI (all-in-one, 705 lines)
│   ├── layout.tsx                        # Root layout + metadata
│   ├── robots.ts                         # SEO: robots.txt
│   ├── sitemap.ts                        # SEO: sitemap
│   ├── opengraph-image.tsx               # Social preview image
│   ├── api/
│   │   ├── score/route.ts                # Claude scoring endpoint (rate-limited 10/min)
│   │   └── waitlist/route.ts             # Email capture (rate-limited 3/min)
│   └── blog/
│       ├── page.tsx                      # Blog index
│       └── youtube-title-tips/page.tsx   # Sample article: YouTube title formulas
```

## Getting Started

### Prerequisites
- Node.js 18+
- `ANTHROPIC_API_KEY` — Get from [console.anthropic.com](https://console.anthropic.com)
- `RESEND_API_KEY` (optional) — For waitlist emails at [resend.com](https://resend.com)

### Installation & Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Environment Variables

Create a `.env.local` file:

```env
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re_...                    # Optional
WAITLIST_NOTIFY_EMAIL=team@example.com   # Where to send waitlist signups
```

### Build & Deploy

```bash
npm run build
npm start
```

Deploy to Vercel:

```bash
npx vercel --prod --scope mslugga35s-projects
```

## API Endpoints

### POST `/api/score`

Score a YouTube title.

**Request:**
```json
{
  "title": "I Tried EVERY YouTube Growth Hack and Here's What Actually Works",
  "niche": "YouTube Creator Tools",
  "thumbnail": "data:image/jpeg;base64,..." // Optional
}
```

**Response:**
```json
{
  "total_score": 87,
  "grade": "A",
  "curiosity": { "score": 18, "reason": "Strong pattern interrupt with 'EVERY'..." },
  "emotion": { "score": 16, "reason": "Excitement from 'EVERY' and 'Works'..." },
  "clarity": { "score": 17, "reason": "Crystal clear topic." },
  "search_browse": { "score": 18, "reason": "Excellent keyword density..." },
  "packaging": { "score": 18, "reason": "Perfect length (58 chars), power words..." },
  "improved_titles": [
    "EVERY YouTube Growth Hack I Tested (Only 3 Worked)",
    "YouTube Growth Hacks That ACTUALLY Work in 2026",
    "I Tested 50+ Growth Hacks... Here's What Stuck"
  ],
  "key_issue": "Could be slightly shorter for mobile scroll.",
  "quick_fix": "Shorten to 55 chars while keeping power words."
}
```

### POST `/api/waitlist`

Subscribe email to waitlist.

**Request:**
```json
{ "email": "user@example.com" }
```

**Response:**
```json
{ "success": true, "message": "Added to waitlist" }
```

## Rate Limiting

- **Scoring:** 10 requests per minute per IP
- **Waitlist:** 3 requests per minute per IP

## Next Priorities

From the [CLAUDE.md](./CLAUDE.md):

1. **YouTube Data API integration** — Fetch real channel stats for personalized scoring
2. **Bulk scoring** — Score multiple titles at once
3. **A/B title comparison** — Side-by-side comparison mode
4. **History** — Save past scores (requires DB, e.g., Supabase)
5. **SEO** — Expand blog content for organic traffic
6. **Distribution** — Reddit (r/NewTubers, r/youtube), X posts

## Contributing

Contributions welcome! Please open an issue or PR.

## License

MIT
