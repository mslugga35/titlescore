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

function ScoreBar({
  label,
  score,
  max,
  reason,
}: {
  label: string;
  score: number;
  max: number;
  reason: string;
}) {
  const pct = (score / max) * 100;
  const color =
    pct >= 80
      ? "bg-emerald-500"
      : pct >= 60
        ? "bg-blue-500"
        : pct >= 40
          ? "bg-orange-500"
          : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-zinc-200">{label}</span>
        <span className="text-zinc-400">
          {score}/{max}
        </span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-zinc-500">{reason}</p>
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <div className="relative max-w-3xl mx-auto px-4 pt-20 pb-10">
        <div className="hero-glow" />
        <div className="text-center space-y-5 relative">
          <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-400 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI-Powered CTR Prediction
          </div>
          <h1 className="animate-fade-up-delay-1 text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Score Your Title
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Before You Upload
            </span>
          </h1>
          <p className="animate-fade-up-delay-2 text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Get an instant CTR prediction score for your YouTube title and
            thumbnail. Fix weak spots before they cost you views.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Video Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScore()}
                placeholder="I Survived 100 Days in Minecraft Hardcore..."
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                maxLength={150}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-600">
                {title.length}/150
              </span>
            </div>
          </div>

          {/* Niche Toggle */}
          <button
            onClick={() => setShowNiche(!showNiche)}
            className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showNiche ? "rotate-180" : ""}`}
            />
            Add niche context (optional)
          </button>

          {showNiche && (
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g., Gaming, Finance, Cooking, Tech Reviews"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            />
          )}

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Thumbnail (optional — adds visual analysis)
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-zinc-700 rounded-xl p-4 text-center cursor-pointer hover:border-zinc-500 transition-colors"
            >
              {thumbnailPreview ? (
                <div className="space-y-2">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="max-h-40 mx-auto rounded-lg"
                  />
                  <p className="text-xs text-zinc-500">Click to replace</p>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <Upload className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-sm text-zinc-500">
                    Drop thumbnail here or click to upload
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnail}
              className="hidden"
            />
          </div>

          {/* Score Button */}
          <button
            onClick={handleScore}
            disabled={loading || !title.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Score My Title
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-2xl mx-auto px-4 pb-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="max-w-2xl mx-auto px-4 pb-16 space-y-4">
          {/* Grade Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">CTR Score</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-bold tracking-tight">
                    {result.total_score}
                  </span>
                  <span className="text-2xl text-zinc-500">/100</span>
                </div>
              </div>
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradeColors[result.grade] || gradeColors.C} flex items-center justify-center`}
              >
                <span className="text-4xl font-black text-white">
                  {result.grade}
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-zinc-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Score Breakdown
            </h3>
            <ScoreBar label="Curiosity Gap" score={result.curiosity.score} max={20} reason={result.curiosity.reason} />
            <ScoreBar label="Emotional Trigger" score={result.emotion.score} max={20} reason={result.emotion.reason} />
            <ScoreBar label="Clarity" score={result.clarity.score} max={20} reason={result.clarity.reason} />
            <ScoreBar label="Search/Browse Fit" score={result.search_browse.score} max={20} reason={result.search_browse.reason} />
            <ScoreBar label="Packaging Power" score={result.packaging.score} max={20} reason={result.packaging.reason} />
          </div>

          {/* Key Issue + Quick Fix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <h4 className="font-semibold text-red-300 text-sm">Biggest Issue</h4>
              </div>
              <p className="text-sm text-zinc-300">{result.key_issue}</p>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className="font-semibold text-emerald-300 text-sm">Quick Fix</h4>
              </div>
              <p className="text-sm text-zinc-300">{result.quick_fix}</p>
            </div>
          </div>

          {/* Improved Titles */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold text-zinc-200 flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              AI-Improved Titles
            </h3>
            <div className="space-y-2">
              {result.improved_titles.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-zinc-800/50 rounded-xl px-4 py-3 group hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-sm text-zinc-200">{t}</span>
                  <button
                    onClick={() => copyTitle(t, i)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    {copied === i ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-zinc-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-600 mt-3">
              Click a title to copy, then paste into the scorer to re-evaluate
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
            className="w-full py-3 px-6 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            Score Another Title
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-sm text-zinc-600">
        TitleScore — AI-Powered YouTube CTR Prediction
      </footer>
    </div>
  );
}
