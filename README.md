# TitleScore

> AI-powered YouTube title CTR analyzer. Get instant scoring, suggestions, and optimization tips for your video titles.

**Live:** https://gettitlescore.com

## About

TitleScore uses Claude AI to analyze YouTube video titles and provide a detailed CTR (click-through rate) optimization score. Whether you're a content creator, SEO specialist, or growth marketer, TitleScore helps you craft titles that get clicked.

Simply enter your video title, optionally add your channel's niche, and TitleScore will:
- **Score your title** on 5 critical dimensions (0-100 total)
- **Explain weaknesses** with actionable feedback
- **Suggest better titles** optimized for clicks
- **Grade on a curve** (S/A/B/C/D/F) for easy benchmarking

## How It Works

### Scoring Dimensions (20 points each = 100 total)

| Dimension | What it measures |
|-----------|------------------|
| **Curiosity Gap** | Does the title tease without revealing? Does it create an irresistible urge to click? |
| **Emotional Trigger** | Does it evoke shock, excitement, fear, joy, or anger? |
| **Clarity** | Is it immediately clear what the video is about? |
| **Search/Browse Fit** | Would it work in YouTube search and suggested videos? Good keyword density? |
| **Packaging Power** | Length (50-60 chars ideal), power words, numbers, formatting? |

### Grade Scale

| Grade | Range | Interpretation |
|-------|-------|-----------------|
| **S** | 90-100 | Outstanding — likely to perform well |
| **A** | 75-89 | Great — strong CTR potential |
| **B** | 60-74 | Good — room for improvement |
| **C** | 45-59 | Fair — needs work |
| **D** | 30-44 | Poor — significant issues |
| **F** | 0-29 | Failing — major rework needed |

## Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **AI:** Claude Haiku (via Anthropic SDK)
- **Backend:** Next.js API Routes (serverless)
- **Hosting:** Vercel
- **Typography:** DM Sans (body), JetBrains Mono (monospace)
- **Icons:** Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- `ANTHROPIC_API_KEY` — Get one at [console.anthropic.com](https://console.anthropic.com)
- `RESEND_API_KEY` (optional) — For waitlist emails via [Resend](https://resend.com)

### Local Development

```bash
# Install dependencies
npm install

# Set environment variables
cat > .env.local << EOF
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re-...
WAITLIST_NOTIFY_EMAIL=you@example.com
EOF

# Run dev server
npm run dev

# Open http://localhost:3000
```

### Build & Deploy

```bash
npm run build
npm start

# Or deploy to Vercel:
npx vercel --prod --scope mslugga35s-projects
```

## API Endpoints

### POST `/api/score`

Score a YouTube title with optional thumbnail and niche context.

**Request:**
```json
{
  "title": "How I Made $100k in 30 Days with This SECRET Method 🤯",
  "niche": "Personal Finance",
  "thumbnail": "data:image/jpeg;base64,..." // optional
}
```

**Response:**
```json
{
  "total_score": 87,
  "grade": "A",
  "curiosity": { "score": 18, "reason": "..." },
  "emotion": { "score": 17, "reason": "..." },
  "clarity": { "score": 16, "reason": "..." },
  "search_browse": { "score": 19, "reason": "..." },
  "packaging": { "score": 17, "reason": "..." },
  "improved_titles": ["...", "...", "..."],
  "key_issue": "...",
  "quick_fix": "..."
}
```

**Rate Limit:** 10 requests per minute per IP

### POST `/api/waitlist`

Add email to waitlist (future features).

**Request:**
```json
{
  "email": "you@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Added to waitlist"
}
```

**Rate Limit:** 3 requests per minute per IP

## Blog

TitleScore includes a built-in SEO blog with content about YouTube optimization:

- **Routes:** `/blog`, `/blog/youtube-title-tips`
- **Data:** `src/lib/blog-data.ts`
- **Sitemap:** Auto-generated at `/sitemap.ts`

Add new articles by updating `blogPosts` in `blog-data.ts`.

## Project Structure

```
src/
├── app/
│   ├── api/                  # API routes (score, waitlist)
│   ├── blog/                 # Blog pages
│   ├── layout.tsx            # Root layout, fonts, metadata
│   ├── page.tsx              # Homepage (all-in-one UI)
│   ├── globals.css           # Tailwind + custom animations
│   └── sitemap.ts            # XML sitemap
├── lib/
│   └── blog-data.ts          # Blog post definitions
└── components/               # (none yet — UI is inline in page.tsx)
```

## Development

### Linting

```bash
npm run lint
```

### Adding Features

⚠️ **Current architecture:** All UI is in `src/app/page.tsx` (705 lines). Consider extracting components if adding pages or significant features.

### Testing

No automated tests yet. Manual testing on staging before deploy:

```bash
# 1. Test scoring endpoint
curl -X POST http://localhost:3000/api/score \
  -H "Content-Type: application/json" \
  -d '{"title":"My Test Title"}'

# 2. Test waitlist endpoint
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 3. Visually test UI at http://localhost:3000
```

## Next Priorities

These are tracked in the code but not yet implemented:

1. **YouTube Data API integration** — Fetch real channel stats for personalized scoring
2. **Bulk scoring** — Score multiple titles at once, compare A/B variants
3. **History** — Save past scores (needs Supabase or similar)
4. **Advanced analytics** — Track which titles got best CTR over time
5. **Distribution** — X/Twitter, Reddit (r/NewTubers, r/youtube), Discord

## Security

- **Rate limiting:** In-memory per-IP (10/min scores, 3/min waitlist)
- **Input validation:** Title max 200 chars, niche max 100 chars, thumbnail max 5MB
- **Media types:** Restricted to PNG, JPEG, WebP, GIF
- **No logging:** User emails and data not logged in production

## Deployment

Deployed on Vercel with automatic deployments from `master` branch.

**Cost:** Currently under $20/month for API usage.

⚠️ **Never create Vercel deploy hooks** — they cost $20+ per hook. Use Git + Vercel webhook instead.

## Contributing

1. Create a branch: `git checkout -b feature/your-feature`
2. Make changes, test locally
3. Run `npm run lint` and fix any issues
4. Commit with clear messages: `git commit -m "feat: describe change"`
5. Push and open a PR to `master`

## License

MIT (implied from repo structure)

---

**Questions?** Open an issue or check the [live site](https://gettitlescore.com).
