import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog — YouTube Title Tips & CTR Strategies | TitleScore",
  description:
    "Learn how to write YouTube titles that get clicks. Data-driven tips on CTR, curiosity gaps, emotional triggers, and proven title formulas from the TitleScore team.",
  metadataBase: new URL("https://gettitlescore.com"),
  alternates: {
    canonical: "https://gettitlescore.com/blog",
  },
  openGraph: {
    title: "Blog — YouTube Title Tips & CTR Strategies | TitleScore",
    description:
      "Learn how to write YouTube titles that get clicks. Data-driven tips on CTR, curiosity gaps, and proven title formulas.",
    url: "https://gettitlescore.com/blog",
    siteName: "TitleScore",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — YouTube Title Tips & CTR Strategies | TitleScore",
    description:
      "Learn how to write YouTube titles that get clicks. Data-driven tips on CTR, curiosity gaps, and proven title formulas.",
  },
  robots: { index: true, follow: true },
};

const posts = blogPosts;

export default function BlogIndex() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Nav */}
      <nav className="border-b" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-sm tracking-tight transition-colors"
            style={{ color: "rgba(220,220,245,0.85)" }}
          >
            TitleScore
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="text-sm transition-colors"
              style={{ color: "rgba(180,180,220,0.5)" }}
            >
              Scorer
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium"
              style={{ color: "rgba(160,180,255,0.9)" }}
            >
              Blog
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="relative max-w-4xl mx-auto px-5 pt-14 pb-10">
        <div className="hero-glow" />
        <div className="relative space-y-3">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "rgba(124,111,247,0.8)" }}
          >
            TitleScore Blog
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            YouTube Growth,{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(110deg, #60a5fa 10%, #818cf8 50%, #c084fc 90%)",
              }}
            >
              Decoded
            </span>
          </h1>
          <p className="text-base max-w-xl" style={{ color: "rgba(200,200,240,0.5)" }}>
            Data-driven guides on writing titles that get clicks, understanding CTR mechanics, and
            growing your channel with better packaging.
          </p>
        </div>
      </section>

      {/* Post grid */}
      <section className="max-w-4xl mx-auto px-5 pb-20">
        <div className="grid gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block result-card p-6 space-y-4"
              style={{ textDecoration: "none" }}
            >
              {/* Color bar accent */}
              <div
                className={`h-1 w-12 rounded-full bg-gradient-to-r ${post.gradient} transition-all duration-300 group-hover:w-20`}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="feature-pill text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h2
                className="text-lg font-bold leading-snug tracking-tight transition-colors"
                style={{ color: "rgba(235,235,255,0.92)" }}
              >
                {post.title}
              </h2>

              {/* Description */}
              <p className="text-sm leading-relaxed" style={{ color: "rgba(180,180,220,0.55)" }}>
                {post.description}
              </p>

              {/* Meta */}
              <div
                className="flex items-center gap-3 text-xs pt-1"
                style={{ color: "rgba(180,180,220,0.3)" }}
              >
                <span>{post.date}</span>
                <span
                  className="w-px h-3"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                />
                <span>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
  );
}
