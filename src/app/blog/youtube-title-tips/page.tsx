import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "7 YouTube Title Formulas That Actually Get Clicks (2026) | TitleScore",
  description:
    "The exact YouTube title formulas top creators use to drive clicks. Learn how to write titles using curiosity gaps, emotional triggers, numbers, and search-intent patterns — with real examples.",
  metadataBase: new URL("https://gettitlescore.com"),
  alternates: {
    canonical: "https://gettitlescore.com/blog/youtube-title-tips",
  },
  openGraph: {
    title: "7 YouTube Title Formulas That Actually Get Clicks (2026)",
    description:
      "The exact formulas top creators use to drive clicks. Curiosity gaps, emotional triggers, numbers, and search-intent patterns — with real examples and a scoring framework.",
    url: "https://gettitlescore.com/blog/youtube-title-tips",
    siteName: "TitleScore",
    type: "article",
    publishedTime: "2026-03-13",
  },
  twitter: {
    card: "summary_large_image",
    title: "7 YouTube Title Formulas That Actually Get Clicks (2026)",
    description:
      "The exact formulas top creators use to drive clicks. Learn curiosity gaps, emotional triggers, and search-intent patterns — with real examples.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "7 YouTube Title Formulas That Actually Get Clicks (2026)",
  description:
    "The exact YouTube title formulas top creators use to drive clicks. Learn how to write titles using curiosity gaps, emotional triggers, numbers, and search-intent patterns.",
  datePublished: "2026-03-13",
  dateModified: "2026-03-13",
  author: {
    "@type": "Organization",
    name: "TitleScore",
    url: "https://gettitlescore.com",
  },
  publisher: {
    "@type": "Organization",
    name: "TitleScore",
    url: "https://gettitlescore.com",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://gettitlescore.com/blog/youtube-title-tips",
  },
  keywords: [
    "youtube title tips",
    "youtube title formulas",
    "how to write youtube titles",
    "youtube CTR",
    "click through rate youtube",
  ],
};

function Formula({
  number,
  name,
  pattern,
  why,
  examples,
  avoid,
}: {
  number: number;
  name: string;
  pattern: string;
  why: string;
  examples: string[];
  avoid: string;
}) {
  return (
    <div
      className="result-card p-6 sm:p-7 space-y-5"
      id={`formula-${number}`}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
            color: "white",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {number}
        </div>
        <div className="space-y-1 pt-0.5">
          <h2 className="text-xl font-bold tracking-tight" style={{ color: "rgba(235,235,255,0.95)" }}>
            {name}
          </h2>
          <code
            className="text-xs px-2.5 py-1 rounded-md font-mono"
            style={{
              background: "rgba(124,111,247,0.1)",
              border: "1px solid rgba(124,111,247,0.2)",
              color: "rgba(180,160,255,0.85)",
            }}
          >
            {pattern}
          </code>
        </div>
      </div>

      {/* Why it works */}
      <div
        className="rounded-xl p-4 text-sm leading-relaxed"
        style={{
          background: "rgba(79,142,247,0.05)",
          border: "1px solid rgba(79,142,247,0.12)",
          color: "rgba(200,210,240,0.75)",
        }}
      >
        <span
          className="font-semibold text-xs uppercase tracking-widest block mb-1.5"
          style={{ color: "rgba(100,150,255,0.6)" }}
        >
          Why it works
        </span>
        {why}
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "rgba(200,200,240,0.35)" }}
        >
          Real examples
        </p>
        {examples.map((ex, i) => (
          <div
            key={i}
            className="title-row flex items-center gap-3 px-4 py-3"
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "rgba(124,111,247,0.6)" }}
            />
            <span className="text-sm leading-snug" style={{ color: "rgba(220,220,245,0.8)" }}>
              {ex}
            </span>
          </div>
        ))}
      </div>

      {/* Common mistake */}
      <div
        className="rounded-xl p-4 text-sm leading-relaxed"
        style={{
          background: "rgba(239,68,68,0.04)",
          border: "1px solid rgba(239,68,68,0.12)",
          color: "rgba(200,180,180,0.65)",
        }}
      >
        <span
          className="font-semibold text-xs uppercase tracking-widest block mb-1.5"
          style={{ color: "rgba(248,113,113,0.6)" }}
        >
          Common mistake to avoid
        </span>
        {avoid}
      </div>
    </div>
  );
}

export default function YouTubeTitleTipsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        className="min-h-screen"
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        {/* Nav */}
        <nav
          className="border-b"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="font-bold text-sm tracking-tight"
              style={{ color: "rgba(220,220,245,0.85)" }}
            >
              TitleScore
            </Link>
            <div className="flex items-center gap-5">
              <Link
                href="/"
                className="text-sm transition-colors not-found-link"
              >
                Scorer
              </Link>
              <Link
                href="/blog"
                className="text-sm transition-colors not-found-link"
              >
                Blog
              </Link>
            </div>
          </div>
        </nav>

        {/* Article header */}
        <header className="relative max-w-3xl mx-auto px-5 pt-12 pb-8">
          <div className="hero-glow" />
          <div className="relative space-y-5">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-xs" style={{ color: "rgba(180,180,220,0.4)" }}>
                <li>
                  <Link href="/" className="transition-colors not-found-link">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/blog" className="transition-colors not-found-link">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li style={{ color: "rgba(180,180,220,0.6)" }}>YouTube Title Tips</li>
              </ol>
            </nav>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {["CTR", "Title Formulas", "YouTube Growth"].map((tag) => (
                <span key={tag} className="feature-pill text-xs">
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05]">
              7 YouTube Title Formulas That Actually Get Clicks{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(110deg, #60a5fa 10%, #818cf8 50%, #c084fc 90%)",
                }}
              >
                (2026)
              </span>
            </h1>

            {/* Meta */}
            <div
              className="flex flex-wrap items-center gap-4 text-sm"
              style={{ color: "rgba(180,180,220,0.4)" }}
            >
              <span>March 13, 2026</span>
              <span className="w-px h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
              <span>8 min read</span>
              <span className="w-px h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
              <span>By TitleScore</span>
            </div>
          </div>
        </header>

        {/* Article body */}
        <article className="max-w-3xl mx-auto px-5 pb-6">

          {/* Intro */}
          <div
            className="rounded-2xl p-6 sm:p-8 mb-8 space-y-4 text-base leading-relaxed"
            style={{
              background: "linear-gradient(135deg, var(--surface) 0%, rgba(14,14,26,0.8) 100%)",
              border: "1px solid var(--border)",
              color: "rgba(200,210,240,0.75)",
            }}
          >
            <p>
              Most YouTube creators treat titles as an afterthought — they spend hours filming,
              editing, and color grading, then type something generic in 30 seconds before hitting
              upload.
            </p>
            <p>
              That's backwards. Your title and thumbnail are the entire pitch. They determine
              whether a viewer clicks or scrolls past. A video with a 4% CTR reaches roughly{" "}
              <strong style={{ color: "rgba(220,220,255,0.9)" }}>twice the audience</strong> as the
              same video with a 2% CTR, assuming equal watch time — because the algorithm rewards
              clicks that turn into watch sessions.
            </p>
            <p>
              After analyzing thousands of high-performing titles across every major niche, seven
              structural formulas show up again and again. Not vague advice like "be specific" —
              actual fill-in-the-blank patterns with clear psychological mechanics behind each one.
            </p>
          </div>

          {/* Table of contents */}
          <div
            className="rounded-2xl p-5 mb-8"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "rgba(200,200,240,0.35)" }}
            >
              In this article
            </p>
            <ol className="space-y-1.5">
              {[
                "The Curiosity Gap",
                "The Numbered List",
                "The Challenge / Stakes Frame",
                "The Specific Transformation",
                "The Contrarian Claim",
                "The Social Proof Anchor",
                "The Search-Intent Hybrid",
              ].map((title, i) => (
                <li key={i}>
                  <a
                    href={`#formula-${i + 1}`}
                    className="flex items-center gap-2.5 text-sm transition-colors group"
                    style={{ color: "rgba(160,180,255,0.55)" }}
                  >
                    <span
                      className="text-xs font-mono w-5 text-right shrink-0"
                      style={{ color: "rgba(124,111,247,0.5)" }}
                    >
                      {i + 1}.
                    </span>
                    <span className="group-hover:text-[rgba(160,180,255,0.85)] transition-colors">
                      {title}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Why titles matter — deeper context */}
          <div className="mb-8 space-y-4 text-base leading-relaxed" style={{ color: "rgba(200,210,240,0.7)" }}>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "rgba(235,235,255,0.95)" }}>
              What actually makes a title perform
            </h2>
            <p>
              YouTube's algorithm doesn't push videos — it pushes{" "}
              <em style={{ color: "rgba(220,220,255,0.85)" }}>click decisions</em>. The platform A/B
              tests your title against your thumbnail across a small initial audience. If people
              click and stay, it widens distribution. If they scroll past, it doesn't.
            </p>
            <p>
              High-CTR titles reliably hit at least two or three of these five levers:
            </p>
            <ul className="space-y-2 pl-4">
              {[
                ["Curiosity gap", "Something is left unresolved. The viewer needs to click to close the loop."],
                ["Emotional charge", "The title triggers anticipation, fear, excitement, or surprise."],
                ["Clarity", "The viewer immediately understands what they'll get or see."],
                ["Search fit", "It matches the words someone is already typing into the search bar."],
                ["Packaging signal", "Numbers, brackets, or power words make the value feel tangible."],
              ].map(([term, def]) => (
                <li key={term} className="flex items-start gap-2.5 text-sm">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 mt-2"
                    style={{ background: "rgba(124,111,247,0.6)" }}
                  />
                  <span>
                    <strong style={{ color: "rgba(220,220,255,0.85)" }}>{term}:</strong>{" "}
                    {def}
                  </span>
                </li>
              ))}
            </ul>
            <p>
              Every formula below is engineered to activate multiple levers at once. That's why they
              outperform "clever" one-off titles — structure compounds.
            </p>
          </div>

          {/* Formulas */}
          <div className="space-y-6 mb-10">
            <Formula
              number={1}
              name="The Curiosity Gap"
              pattern="[Intriguing premise] — [withheld conclusion]"
              why="The brain treats an open loop as a mild cognitive itch. By presenting a premise without resolving it, you make clicking feel necessary rather than optional. The key is that the gap must be specific enough to feel real, but vague enough that the answer isn't obvious. Generic curiosity gaps ('This Will Shock You') have been trained out of viewers; specific ones haven't."
              examples={[
                "I Replaced My Entire Workflow With AI for 30 Days — Here's What Broke",
                "The One Setting Every New Investor Ignores (And Why It's Costing Them)",
                "We Tested Every Major Sleep Protocol. Only One Actually Worked.",
                "Why I Deleted 200 Videos From My Channel (and Watch Time Went Up)",
              ]}
              avoid="Avoid vague curiosity bait like 'You Won't Believe This' or 'Wait Until the End.' Modern viewers have seen these so often they've become skip signals. Your specific outcome or twist should be just legible enough to feel credible."
            />

            <Formula
              number={2}
              name="The Numbered List"
              pattern="[Number] [Things/Ways/Reasons] [Target Audience] [Benefit/Fear/Situation]"
              why="Numbers do three things simultaneously: they set expectations (you know exactly what you're getting into), they make the value feel bounded and completable, and they function as a packaging signal that the creator has done organizational work on your behalf. Odd numbers tend to outperform even numbers — 7 and 11 historically beat 6 and 10 — likely because odd numbers feel less arbitrary."
              examples={[
                "7 Editing Mistakes That Make Beginner Videos Look Amateur",
                "11 Things Millionaires Do Differently in the First Hour of the Day",
                "5 Protein Sources That Are Way Cheaper Than Chicken",
                "9 Free Tools That Replace $500/Month Software Subscriptions",
              ]}
              avoid="Don't pad your list to hit a 'better' number. If you only have 4 strong points, a 4-item list beats a diluted 7. Viewers who feel a list was padded leave negative signals in comments, and that tanks watch time — which tanks distribution."
            />

            <Formula
              number={3}
              name="The Challenge / Stakes Frame"
              pattern="I [Did/Tried/Attempted] [Extreme Constraint] for [Time Period] — [Unexpected Outcome]"
              why="Challenge videos create a built-in story arc that the viewer already knows how to follow: setup, struggle, resolution. The constraint does the narrative heavy lifting. Viewers experience vicarious stakes without having to do the thing themselves, which is exactly why reality TV has dominated for decades. Adding an unexpected outcome in the title converts a format into a curiosity gap."
              examples={[
                "I Ate Like a 1920s Laborer for a Week — My Bloodwork Was Surprising",
                "I Learned Piano With Only AI Feedback for 90 Days",
                "We Ran a Business With Only Free Tools for 6 Months. Here's the P&L.",
                "I Tried Every Viral Productivity System. This Is What Actually Moved the Needle.",
              ]}
              avoid="The challenge needs real constraints or it reads as clickbait. Vague challenges ('I Did Something Crazy for 30 Days') don't convert because the viewer can't project themselves into a concrete scenario. Be as specific as possible about the constraint and the time period."
            />

            <Formula
              number={4}
              name="The Specific Transformation"
              pattern="How I Went From [Specific Bad Starting Point] to [Specific Good Outcome] in [Timeframe]"
              why="This formula hits the 'before/after' pattern that anchors almost all high-converting marketing. The psychology is simple: viewers self-sort based on whether they identify with the starting point. A specific before-state is more powerful than a generic one because it signals authenticity — broad claims feel fabricated, narrow claims feel earned. The timeframe creates urgency and makes the outcome feel achievable."
              examples={[
                "How I Went From 200 to 47,000 Subscribers in 8 Months Without Posting Daily",
                "From $4k in Debt to $15k Saved: What Changed in 12 Months",
                "How My Channel Went From 0.8% CTR to 6.2% CTR With One Change",
                "I Learned to Cook Steak Properly in 21 Days. Here's the Exact Process.",
              ]}
              avoid="Avoid vague starting and ending points. 'How I Became Successful' is unclick-able. The specificity of both endpoints is the entire mechanism. Round numbers (from 0 to 100k) are fine only if true — viewers have good instincts for when numbers feel fabricated."
            />

            <Formula
              number={5}
              name="The Contrarian Claim"
              pattern="[Widely accepted belief] is [Wrong/Dead/Overrated] — [What to Do Instead]"
              why="Disagreement is one of the most powerful engagement triggers on the internet. When a title challenges something the viewer already believes, it creates an immediate cognitive response: either they're curious to see if you're right, or they want to be proven correct by watching and disagreeing. Both outcomes mean a click. The 'what to do instead' component is critical — without it, the title is just provocative rather than useful."
              examples={[
                "HIIT Is Overrated. Here's What Actually Burns Fat Long-Term.",
                "Stop Using the 50/30/20 Budget Rule. Do This Instead.",
                "Why Posting Every Day Is the Worst Advice for New YouTubers",
                "The College Degree Is Not Dead — But This Version of It Is",
              ]}
              avoid="The contrarian position has to be defensible. If your video's actual argument is weak, the comments will destroy your watch time and engagement signals. Only use this formula when you have genuine evidence or a strong case — a clickbait contrarian claim that doesn't deliver makes viewers feel cheated, and they'll remember."
            />

            <Formula
              number={6}
              name="The Social Proof Anchor"
              pattern="[Large credible number] [People/Creators/Experts] [Action] — So I [Tested/Tried/Investigated]"
              why="Social proof activates herd behavior in a way that pure curiosity doesn't. When a viewer sees that a large group has done something or believes something, it creates FOMO — Fear Of Missing Out — which is a stronger motivator than simple curiosity. The 'so I tested it' addition converts the social proof from a claim into a story, which gives the viewer a reason to watch rather than just believe the premise."
              examples={[
                "10 Million Runners Use This Warm-Up Protocol. I Tested It for 60 Days.",
                "Why 80% of Finance YouTubers Recommend This Fund (And Whether It's Right for You)",
                "I Followed Huberman's Morning Routine Exactly for 30 Days. Here's My Data.",
                "The Meal Prep Strategy 500,000 Subscribers Swear By — Tested on a Budget",
              ]}
              avoid="The credibility of your social proof number matters. '10 people' isn't social proof. '10 million' is. Make sure the number you cite is verifiable or at least plausible — viewers will check claims that feel exaggerated, and being caught in an inflation kills trust faster than any other mistake."
            />

            <Formula
              number={7}
              name="The Search-Intent Hybrid"
              pattern="[High-volume search phrase] + [Curiosity or Emotion Layer]"
              why="Search-optimized titles often sacrifice virality for discoverability, and browse-optimized titles sacrifice search traffic for engagement. This hybrid formula layers a specific search phrase (what someone types when they have a problem) with a curiosity or emotional hook. The result performs on both surfaces — browse feed and search results. It's harder to write because both layers must feel natural together, but when it works, it's the most durable title format."
              examples={[
                "How to Start Investing in 2026 (Without Making the Mistakes I Made)",
                "Best Budget Camera for YouTube — What I Actually Use After Buying 7",
                "How to Lose Weight After 40 Without Giving Up Every Food You Love",
                "Credit Score Explained: Why Mine Dropped 80 Points and How I Fixed It",
              ]}
              avoid="Don't keyword-stuff. 'Best YouTube Camera 2026 Review Unboxing Top Picks' is not a hybrid — it's an SEO spam title that signals low quality to viewers browsing the feed. The search phrase should appear naturally in a sentence that also works as a human headline."
            />
          </div>

          {/* Synthesis section */}
          <div className="mb-8 space-y-4">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "rgba(235,235,255,0.95)" }}>
              How to combine formulas (advanced)
            </h2>
            <div
              className="text-base leading-relaxed space-y-4"
              style={{ color: "rgba(200,210,240,0.7)" }}
            >
              <p>
                The most competitive creators don't pick one formula — they layer two. A title can
                be a Numbered List (Formula 2) wrapped inside a Curiosity Gap (Formula 1):
              </p>
              <div
                className="title-row px-4 py-3 text-sm"
                style={{ color: "rgba(220,220,245,0.8)" }}
              >
                "The 5 Investing Rules I Wish I Knew at 25 — Number 3 Took Me 10 Years to Learn"
              </div>
              <p>
                Or a Specific Transformation (Formula 4) anchored with Social Proof (Formula 6):
              </p>
              <div
                className="title-row px-4 py-3 text-sm"
                style={{ color: "rgba(220,220,245,0.8)" }}
              >
                "How 40,000 People Used This Framework to Pay Off Debt in Under a Year"
              </div>
              <p>
                The rule of thumb: combine at most two formulas. Three or more usually produces
                titles that feel overwrought and try-hard. Viewers can smell a title that's been
                engineered by committee.
              </p>
            </div>
          </div>

          {/* Title length section */}
          <div className="mb-8 space-y-4">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "rgba(235,235,255,0.95)" }}>
              Title length: the right answer
            </h2>
            <div
              className="text-base leading-relaxed space-y-4"
              style={{ color: "rgba(200,210,240,0.7)" }}
            >
              <p>
                YouTube truncates titles in browse feed at roughly 60 characters on desktop, fewer
                on mobile. This creates a natural optimization constraint: your highest-value words
                should appear in the first 60 characters, so the truncation always cuts at an
                interesting point rather than a forgettable one.
              </p>
              <p>
                Optimal range is{" "}
                <strong style={{ color: "rgba(220,220,255,0.9)" }}>55–75 characters</strong>{" "}
                for browse-first content, and up to{" "}
                <strong style={{ color: "rgba(220,220,255,0.9)" }}>95 characters</strong> for
                search-first content where the full phrase needs to appear. Going over 100 characters
                rarely pays off on either surface.
              </p>
            </div>
          </div>

          {/* What to test next */}
          <div
            className="result-card p-6 sm:p-7 mb-10 space-y-4"
          >
            <h2 className="text-xl font-bold tracking-tight" style={{ color: "rgba(235,235,255,0.95)" }}>
              Test before you publish
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "rgba(200,210,240,0.7)" }}>
              Every formula above is a starting point, not a guarantee. Your niche, thumbnail style,
              audience age, and tone all interact with how a title performs. The single highest-ROI
              habit successful creators share is testing{" "}
              <em style={{ color: "rgba(220,220,255,0.85)" }}>multiple title drafts</em> before
              committing — not tweaking the live title after a video has already underperformed, but
              before the initial window closes.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "rgba(200,210,240,0.7)" }}>
              Before you upload your next video, score two or three title candidates against the five
              CTR levers: curiosity, emotion, clarity, search fit, and packaging signal. The one
              that hits the most levers at full strength is almost always the right call.
            </p>
          </div>

          {/* CTA */}
          <div
            className="rounded-2xl p-8 sm:p-10 text-center space-y-5"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(124,58,237,0.1) 100%)",
              border: "1px solid rgba(124,111,247,0.2)",
            }}
          >
            <div className="space-y-2">
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "rgba(124,111,247,0.8)" }}
              >
                Try it free
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "rgba(235,235,255,0.97)" }}>
                Score your next title before it goes live
              </h2>
              <p className="text-base max-w-lg mx-auto" style={{ color: "rgba(200,210,240,0.6)" }}>
                TitleScore grades your YouTube title across all five CTR dimensions — curiosity gap,
                emotional trigger, clarity, search fit, and packaging power — and suggests improved
                alternatives in seconds.
              </p>
            </div>
            <Link
              href="/"
              className="btn-primary inline-flex items-center gap-2.5 px-7 py-3.5 text-base font-semibold text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Score My Title — Free
            </Link>
            <p className="text-xs" style={{ color: "rgba(180,180,220,0.25)" }}>
              No account required. Instant results.
            </p>
          </div>
        </article>

        {/* Footer */}
        <footer className="site-footer px-6 py-10 mt-8">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-semibold text-sm tracking-tight" style={{ color: "rgba(220,220,245,0.7)" }}>
                TitleScore
              </p>
              <p className="text-xs" style={{ color: "rgba(180,180,220,0.28)" }}>
                AI-powered YouTube CTR prediction
              </p>
            </div>
            <div className="flex items-center gap-5">
              <span className="text-xs" style={{ color: "rgba(180,180,220,0.22)" }}>
                &copy; {new Date().getFullYear()}
              </span>
              <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.08)" }} />
              <Link href="/blog" className="text-xs transition-colors not-found-link">
                Blog
              </Link>
              <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.08)" }} />
              <a
                href="mailto:hello@gettitlescore.com"
                className="text-xs transition-colors not-found-link"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
