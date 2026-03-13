# TitleScore
> Last verified: 2026-03-13

## Project
- **Repo:** `github.com/mslugga35/titlescore` (branch: `master`)
- **Live:** https://gettitlescore.com
- **Stack:** Next.js 16 + Claude API (Haiku) + Tailwind 4 + Vercel
- **Fonts:** DM Sans (body), JetBrains Mono (monospace)
- **Colors:** Dark mode, blue→indigo→violet gradients (#4f8ef7, #7c6ff7, #a855f7)

---

## Architecture
- **Homepage:** `src/app/page.tsx` (705 lines, client component, all-in-one)
- **Score API:** `src/app/api/score/route.ts` — Claude Haiku, vision-capable, 5-dimension CTR scoring
- **Waitlist API:** `src/app/api/waitlist/route.ts` — Resend email capture
- **Rate limiting:** In-memory per IP (10/min scores, 3/min waitlist)

---

## Scoring Dimensions (20 pts each = 100 total)
1. Curiosity Gap
2. Emotional Trigger
3. Clarity
4. Search/Browse Fit
5. Packaging Power

Grade scale: S (90-100), A (75-89), B (60-74), C (45-59), D (30-44), F (0-29)

---

## Env Vars
| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Claude API |
| `RESEND_API_KEY` | Waitlist emails |
| `WAITLIST_NOTIFY_EMAIL` | Notification recipient |

---

## Deploying
```bash
cd titlescore && npx vercel --prod --scope mslugga35s-projects
```

---

## Next Priorities
1. YouTube Data API integration — fetch real channel stats for personalized scoring
2. Bulk scoring — score multiple titles at once
3. A/B title comparison mode
4. History — save past scores (needs DB, probably Supabase)
5. SEO — add blog content for organic traffic
6. Distribution — Reddit (r/NewTubers, r/youtube), X posts

---

## Gotchas
- All UI is in `page.tsx` (no separate components) — refactor if adding pages
- `ScoreBar` component is inline, not extracted
- Claude model is hardcoded to `claude-haiku-4-5-20251001`
- No database — everything is stateless
- **NEVER create Vercel deploy hooks** (see main CLAUDE.md — cost $221)
