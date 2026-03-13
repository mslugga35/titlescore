"use client";

import { useState, useRef } from "react";
import {
  Zap,
  Upload,
  BarChart3,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Copy,
  Check,
  Mail,
} from "lucide-react";

interface ScoreResult {
  total_score: number;
  grade: "S" | "A" | "B" | "C" | "D" | "F";
  curiosity: { score: number; reason: string };
  emotion: { score: number; reason: string };
  clarity: { score: number; reason: string };
  search_browse: { score: number; reason: string };
  packaging: { score: number; reason: string };
  improved_titles: string[];
  key_issue: string;
  quick_fix: string;
}

const gradeColors: Record<string, string> = {
  S: "from-yellow-400 to-amber-500",
  A: "from-emerald-400 to-green-500",
  B: "from-blue-400 to-indigo-500",
  C: "from-orange-400 to-amber-500",
  D: "from-red-400 to-rose-500",
  F: "from-red-600 to-red-800",
};

const gradeGlow: Record<string, string> = {
  S: "rgba(251,191,36,0.35)",
  A: "rgba(52,211,153,0.3)",
  B: "rgba(99,102,241,0.3)",
  C: "rgba(251,146,60,0.3)",
  D: "rgba(248,113,113,0.3)",
  F: "rgba(220,38,38,0.3)",
};

const barDelayClass = ["", "score-bar-fill-delay-1", "score-bar-fill-delay-2", "score-bar-fill-delay-3", "score-bar-fill-delay-4"];

function ScoreBar({
  label,
  score,
  max,
  reason,
  index = 0,
}: {
  label: string;
  score: number;
  max: number;
  reason: string;
  index?: number;
}) {
  const pct = (score / max) * 100;
  const color =
    pct >= 80
      ? "bg-emerald-500"
      : pct >= 60
        ? "bg-blue-500"
        : pct >= 40
          ? "bg-orange-400"
          : "bg-red-500";
  const glowColor =
    pct >= 80
      ? "rgba(52,211,153,0.6)"
      : pct >= 60
        ? "rgba(99,102,241,0.6)"
        : pct >= 40
          ? "rgba(251,146,60,0.6)"
          : "rgba(248,113,113,0.6)";

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline text-sm">
        <span className="font-medium" style={{ color: "rgba(220,220,240,0.85)" }}>
          {label}
        </span>
        <span
          className="font-mono text-xs font-medium tabular-nums"
          style={{ color: "rgba(200,200,240,0.4)" }}
        >
          {score}
          <span style={{ color: "rgba(200,200,240,0.22)" }}>/{max}</span>
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className={`h-full ${color} rounded-full score-bar-fill ${barDelayClass[index] ?? ""}`}
          style={{
            width: `${pct}%`,
            boxShadow: `0 0 8px ${glowColor}`,
          }}
        />
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "rgba(180,180,210,0.4)" }}>
        {reason}
      </p>
    </div>
  );
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [niche, setNiche] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailMediaType, setThumbnailMediaType] = useState<string>("image/png");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [showNiche, setShowNiche] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<string | null>(null);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Thumbnail must be under 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setThumbnailPreview(dataUrl);
      setThumbnail(dataUrl.split(",")[1]);
      setThumbnailMediaType(file.type || "image/png");
    };
    reader.readAsDataURL(file);
  };

  const handleScore = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          niche: niche.trim() || undefined,
          thumbnail_base64: thumbnail || undefined,
          thumbnail_media_type: thumbnail ? thumbnailMediaType : undefined,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.score);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyTitle = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleWaitlist = async () => {
    if (!waitlistEmail.includes("@")) return;
    setWaitlistLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: waitlistEmail }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok && data.message) {
        setWaitlistStatus(data.message);
        setWaitlistEmail("");
      } else {
        setWaitlistStatus(data.error ?? "Something went wrong");
      }
    } catch {
      setWaitlistStatus("Something went wrong");
    } finally {
      setWaitlistLoading(false);
    }
  };

  return (
    <div id="main-content" className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>

      {/* ── Top nav ── */}
      <nav
        className="border-b"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        aria-label="Site navigation"
      >
        <div className="max-w-3xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <span className="font-bold text-sm tracking-tight" style={{ color: "rgba(220,220,245,0.85)" }}>
            TitleScore
          </span>
          <a
            href="/blog"
            className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
            style={{
              color: "rgba(160,180,255,0.7)",
              background: "rgba(124,111,247,0.08)",
              border: "1px solid rgba(124,111,247,0.15)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "rgba(180,200,255,0.95)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(124,111,247,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "rgba(160,180,255,0.7)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(124,111,247,0.08)";
            }}
          >
            Blog
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative max-w-3xl mx-auto px-5 pt-10 sm:pt-16 pb-8">
        <div className="hero-glow" />
        <div className="relative text-center space-y-4">

          {/* Headline */}
          <div className="animate-fade-up space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.02]">
              Score Your Title
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(110deg, #60a5fa 10%, #818cf8 50%, #c084fc 90%)",
                }}
              >
                Before You Upload
              </span>
            </h1>
          </div>

          {/* Subtext */}
          <p
            className="animate-fade-up-delay-1 text-lg max-w-lg mx-auto leading-relaxed"
            style={{ color: "rgba(200,200,240,0.5)" }}
          >
            Get an instant CTR score for your YouTube title and thumbnail.
            Find weak spots before they cost you views.
          </p>
        </div>
      </section>

      {/* ── Input ── */}
      <section className="max-w-2xl mx-auto px-4 pb-8">
        <div className="input-card space-y-5">

          {/* Title Input */}
          <div className="space-y-2">
            <label
              htmlFor="video-title"
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "rgba(200,200,240,0.35)" }}
            >
              Video Title
            </label>
            <div className="relative">
              <input
                id="video-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScore()}
                placeholder="I Survived 100 Days in Minecraft Hardcore..."
                className="ts-input pr-14"
                maxLength={150}
                aria-label="YouTube video title"
                aria-describedby="title-count"
              />
              <span
                id="title-count"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs tabular-nums"
                style={{ color: title.length > 120 ? "rgba(251,146,60,0.6)" : "rgba(180,180,220,0.22)" }}
                aria-live="polite"
                aria-label={`${title.length} of 150 characters`}
              >
                {title.length}/150
              </span>
            </div>
          </div>

          {/* Niche Toggle */}
          <button
            onClick={() => setShowNiche(!showNiche)}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: "rgba(180,180,240,0.4)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(200,200,255,0.65)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(180,180,240,0.4)")}
            aria-expanded={showNiche}
            aria-controls="niche-input"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${showNiche ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
            Add niche context (optional)
          </button>

          {showNiche && (
            <div id="niche-input" className="niche-expand">
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., Gaming, Finance, Cooking, Tech Reviews"
                className="ts-input text-sm"
                aria-label="Video niche or category (optional)"
              />
            </div>
          )}

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label
              htmlFor="thumbnail-upload"
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "rgba(200,200,240,0.35)" }}
            >
              Thumbnail{" "}
              <span
                className="normal-case font-normal tracking-normal"
                style={{ color: "rgba(180,180,220,0.3)" }}
              >
                — optional, adds visual analysis
              </span>
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="thumb-dropzone p-4 text-center"
              role="button"
              tabIndex={0}
              aria-label={thumbnailPreview ? "Replace thumbnail image" : "Upload thumbnail image"}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
            >
              {thumbnailPreview ? (
                <div className="space-y-2">
                  <img
                    src={thumbnailPreview}
                    alt="Uploaded thumbnail preview"
                    className="max-h-40 mx-auto rounded-lg"
                    style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
                  />
                  <p className="text-xs" style={{ color: "rgba(180,180,220,0.3)" }}>
                    Click to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-2 py-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <Upload className="w-4 h-4" aria-hidden="true" style={{ color: "rgba(180,180,240,0.35)" }} />
                  </div>
                  <p className="text-sm" style={{ color: "rgba(180,180,220,0.35)" }}>
                    Drop thumbnail here or{" "}
                    <span style={{ color: "rgba(100,150,255,0.7)" }}>click to upload</span>
                  </p>
                  <p className="text-xs" style={{ color: "rgba(180,180,220,0.2)" }}>PNG, JPG up to 5 MB</p>
                </div>
              )}
            </div>
            <input
              id="thumbnail-upload"
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnail}
              className="hidden"
              aria-label="Upload thumbnail image"
            />
          </div>

          {/* Score Button */}
          <button
            onClick={handleScore}
            disabled={loading || !title.trim()}
            className="btn-primary w-full py-3.5 px-6 text-base flex items-center justify-center gap-2.5 text-white"
            aria-label={loading ? "Analyzing your title…" : "Score my title"}
          >
            {loading ? (
              <>
                <div
                  className="w-4 h-4 rounded-full border-2 border-t-white animate-spin"
                  style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "white" }}
                  aria-hidden="true"
                />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" aria-hidden="true" />
                <span>Score My Title</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* ── Error ── */}
      {error && (
        <div className="max-w-2xl mx-auto px-4 pb-4">
          <div
            className="rounded-xl p-4 flex items-start gap-3 status-msg"
            style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)" }}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#f87171" }} />
            <p className="text-sm" style={{ color: "rgba(252,165,165,0.85)" }}>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {result && (
        <div className="max-w-2xl mx-auto px-4 pb-16 space-y-4 animate-score-reveal">

          {/* Grade Card */}
          <div
            className="result-card p-5 sm:p-7"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: "rgba(200,200,240,0.35)" }}
                >
                  CTR Score
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="score-number text-6xl sm:text-7xl font-black tracking-tight leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {result.total_score}
                  </span>
                  <span className="text-2xl font-light" style={{ color: "rgba(200,200,240,0.2)" }}>
                    /100
                  </span>
                </div>
                <p className="text-sm mt-2" style={{ color: "rgba(200,200,240,0.4)" }}>
                  {result.total_score >= 80
                    ? "Strong title — ready to publish"
                    : result.total_score >= 60
                      ? "Decent — small tweaks could help"
                      : result.total_score >= 40
                        ? "Needs work before publishing"
                        : "Significant improvements needed"}
                </p>
              </div>
              <div
                className={`grade-badge w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${gradeColors[result.grade] ?? gradeColors.C} flex items-center justify-center shrink-0`}
                style={{ boxShadow: `0 0 40px ${gradeGlow[result.grade] ?? "rgba(99,102,241,0.3)"}` }}
              >
                <span className="text-3xl sm:text-4xl font-black text-white">{result.grade}</span>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="result-card p-5 sm:p-7 space-y-5">
            <h3
              className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2"
              style={{ color: "rgba(200,200,240,0.35)" }}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Score Breakdown
            </h3>
            <ScoreBar label="Curiosity Gap"      score={result.curiosity.score}     max={20} reason={result.curiosity.reason}     index={0} />
            <ScoreBar label="Emotional Trigger"  score={result.emotion.score}       max={20} reason={result.emotion.reason}       index={1} />
            <ScoreBar label="Clarity"            score={result.clarity.score}       max={20} reason={result.clarity.reason}       index={2} />
            <ScoreBar label="Search / Browse Fit" score={result.search_browse.score} max={20} reason={result.search_browse.reason} index={3} />
            <ScoreBar label="Packaging Power"    score={result.packaging.score}     max={20} reason={result.packaging.reason}     index={4} />
          </div>

          {/* Key Issue + Quick Fix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              className="rounded-2xl p-5 space-y-2"
              style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.14)" }}
            >
              <div className="flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5 shrink-0" style={{ color: "#f87171" }} />
                <h4 className="font-semibold text-xs uppercase tracking-widest" style={{ color: "#f87171" }}>
                  Biggest Issue
                </h4>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(220,220,240,0.7)" }}>
                {result.key_issue}
              </p>
            </div>
            <div
              className="rounded-2xl p-5 space-y-2"
              style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.14)" }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: "#34d399" }} />
                <h4 className="font-semibold text-xs uppercase tracking-widest" style={{ color: "#34d399" }}>
                  Quick Fix
                </h4>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(220,220,240,0.7)" }}>
                {result.quick_fix}
              </p>
            </div>
          </div>

          {/* Improved Titles */}
          <div className="result-card p-5 sm:p-7 space-y-4">
            <h3
              className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2"
              style={{ color: "rgba(200,200,240,0.35)" }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
              AI-Improved Titles
            </h3>
            <div className="space-y-2">
              {result.improved_titles.map((t, i) => (
                <div
                  key={i}
                  className="title-row flex items-center justify-between px-4 py-3 group cursor-pointer"
                  onClick={() => copyTitle(t, i)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Copy title: ${t}`}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && copyTitle(t, i)}
                >
                  <span
                    className="text-sm leading-snug flex-1 pr-3"
                    style={{ color: "rgba(220,220,245,0.8)" }}
                  >
                    {t}
                  </span>
                  <div
                    className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                    aria-hidden="true"
                  >
                    {copied === i ? (
                      <Check className="w-3.5 h-3.5" style={{ color: "#34d399" }} />
                    ) : (
                      <Copy className="w-3.5 h-3.5" style={{ color: "rgba(200,200,240,0.5)" }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs" style={{ color: "rgba(180,180,220,0.2)" }}>
              Click any title to copy, then paste into the scorer to re-evaluate
            </p>
          </div>

          {/* Score Again */}
          <button
            onClick={() => {
              setResult(null);
              setTitle("");
              setThumbnail(null);
              setThumbnailMediaType("image/png");
              setThumbnailPreview(null);
            }}
            className="btn-secondary w-full py-3.5 px-6 text-sm flex items-center justify-center gap-2"
            style={{ color: "rgba(200,200,240,0.6)" }}
          >
            <ArrowRight className="w-4 h-4" />
            Score Another Title
          </button>
        </div>
      )}

      {/* ── Divider ── */}
      <div className="section-divider mx-auto max-w-2xl my-2" />

      {/* ── Waitlist ── */}
      <section className="waitlist-section py-14 px-4">
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">

          {/* Headline */}
          <div className="space-y-3">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide"
              style={{
                background: "rgba(124,111,247,0.08)",
                border: "1px solid rgba(124,111,247,0.18)",
                color: "rgba(180,160,255,0.7)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
              Coming soon
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              More power, coming soon
            </h2>
            <p className="text-base max-w-md mx-auto leading-relaxed" style={{ color: "rgba(200,200,240,0.45)" }}>
              YouTube API integration, bulk scoring for entire channels, A/B title testing, and trend-aware scoring.
            </p>
          </div>

          {/* Feature list */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[
              "YouTube API",
              "Bulk scoring",
              "A/B testing",
              "Trend signals",
              "Channel analytics",
            ].map((f) => (
              <span key={f} className="feature-pill">
                <span
                  className="w-1 h-1 rounded-full inline-block"
                  style={{ background: "rgba(124,111,247,0.6)" }}
                />
                {f}
              </span>
            ))}
          </div>

          {/* Email capture */}
          <div className="max-w-md mx-auto space-y-3">
            {waitlistStatus ? (
              <div
                className="rounded-xl px-5 py-4 flex items-center gap-3 status-msg"
                style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.18)" }}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#34d399" }} />
                <p className="text-sm text-left" style={{ color: "rgba(180,240,210,0.85)" }}>
                  {waitlistStatus}
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "rgba(180,180,240,0.3)" }}
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleWaitlist()}
                    placeholder="you@email.com"
                    className="waitlist-input pl-10"
                    aria-label="Email address for waitlist"
                    autoComplete="email"
                  />
                </div>
                <button
                  onClick={handleWaitlist}
                  disabled={waitlistLoading || !waitlistEmail.includes("@")}
                  className="btn-primary px-5 py-3 sm:py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0"
                  aria-label={waitlistLoading ? "Submitting…" : "Notify me when new features launch"}
                >
                  {waitlistLoading ? (
                    <div
                      className="w-4 h-4 rounded-full border-2 animate-spin mx-auto"
                      style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "white" }}
                      aria-hidden="true"
                    />
                  ) : (
                    "Notify me"
                  )}
                </button>
              </div>
            )}
            <p className="text-xs" style={{ color: "rgba(180,180,220,0.22)" }}>
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer px-6 py-10">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-semibold text-sm tracking-tight" style={{ color: "rgba(220,220,245,0.7)" }}>
              TitleScore
            </p>
            <p className="text-xs" style={{ color: "rgba(180,180,220,0.28)" }}>
              AI-powered YouTube CTR prediction
            </p>
          </div>
          <div className="flex items-center gap-5">
            <span
              className="text-xs"
              style={{ color: "rgba(180,180,220,0.22)" }}
            >
              &copy; {new Date().getFullYear()}
            </span>
            <span
              className="w-px h-3"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <a
              href="/blog"
              className="text-xs transition-colors"
              style={{ color: "rgba(180,180,220,0.3)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(160,180,255,0.7)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(180,180,220,0.3)")}
            >
              Blog
            </a>
            <span
              className="w-px h-3"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <a
              href="mailto:hello@gettitlescore.com"
              className="text-xs transition-colors"
              style={{ color: "rgba(180,180,220,0.3)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(160,180,255,0.7)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(180,180,220,0.3)")}
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
