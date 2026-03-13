import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found — TitleScore",
  description: "This page doesn't exist. Head back to TitleScore to score your YouTube titles.",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "400px",
          height: "300px",
          background:
            "radial-gradient(ellipse at center, rgba(124,111,247,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div className="relative space-y-6 max-w-md">
        {/* 404 number */}
        <div
          className="text-8xl font-black tracking-tight leading-none bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(110deg, #60a5fa 10%, #818cf8 50%, #c084fc 90%)",
          }}
        >
          404
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
          <p className="text-base leading-relaxed" style={{ color: "rgba(200,200,240,0.5)" }}>
            This page doesn&apos;t exist. Maybe the title needed a higher CTR score.
          </p>
        </div>

        {/* Back button */}
        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white rounded-xl"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
            border: "1px solid rgba(124, 58, 237, 0.4)",
            textDecoration: "none",
          }}
        >
          <Zap className="w-4 h-4" aria-hidden="true" />
          Back to TitleScore
        </Link>

        {/* Also show a plain text link */}
        <p className="text-xs" style={{ color: "rgba(180,180,220,0.25)" }}>
          <Link
            href="/"
            className="not-found-link transition-colors"
          >
            <ArrowLeft className="w-3 h-3 inline mr-1" aria-hidden="true" />
            gettitlescore.com
          </Link>
        </p>
      </div>
    </div>
  );
}
