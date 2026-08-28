# TitleScore
> Last verified: 2026-08-28

## Project
- **Repo:** `github.com/mslugga35/titlescore` (branch: `master`)
- **Live:** https://gettitlescore.com
- **Stack:** Next.js 16 static export (`out/`) + CF Pages Functions + Claude API (Haiku) + Tailwind 4
- **Host:** Cloudflare Pages project `titlescore` (**not Vercel**, despite older notes)
- **Fonts:** DM Sans (body), JetBrains Mono (monospace)
- **Colors:** Dark mode, blue→indigo→violet gradients (#4f8ef7, #7c6ff7, #a855f7)

---

## Architecture
- **Homepage:** `src/app/page.tsx` (705 lines, client component, all-in-one)
- **Score API:** `functions/api/score.js` — Claude Haiku, vision-capable, 5-dimension CTR scoring
- **Waitlist API:** `functions/api/waitlist.js` — Resend email capture
- **WebMCP:** `public/webmcp.js` — exposes `score_youtube_title` to in-browser agents
- Migrated off Next.js API routes 2026-08-28; `src/app/api/` no longer exists
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
cd titlescore && npm run build
unset CF_API_TOKEN   # set CF_API_TOKEN blocks wrangler
npx wrangler pages deploy out --project-name=titlescore --branch=main --commit-dirty=true
```
⚠️ `--branch=main` is **required** — the Pages production branch is `main`, and wrangler
otherwise infers the local git branch and publishes a **Preview** the live domain never serves.

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
- Claude model is hardcoded in `functions/api/score.js`, as `claude-haiku-4-5`.
  **Model IDs take no date suffix** — the old `claude-haiku-4-5-20251001` is not a valid ID
- 🚨 **Scoring was down ~4 months** (found 2026-08-28): the Anthropic account's **credit
  balance was empty**, so every request 400'd and the handler collapsed it into a bare 500.
  It now returns a distinct **503 `upstream_account_credit`**, and other upstream failures
  return `upstream_status`/`upstream_type`. **Nothing alerted — the only feature was dead
  and no monitor noticed.** Restoring credits is the actual fix
- Local git HEAD was `overnight/titlescore/2026-03-15`, not `master`; master was 3 behind
  and has been fast-forwarded. Check the branch before assuming master is trunk
- No database — everything is stateless
- **NEVER create Vercel deploy hooks** (see main CLAUDE.md — cost $221)
