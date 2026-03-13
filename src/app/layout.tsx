import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "TitleScore",
  url: "https://gettitlescore.com",
  description:
    "Score your YouTube title and thumbnail before you upload. AI-powered CTR prediction that helps you fix weak spots before they cost you views.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "AI-powered CTR scoring",
    "Thumbnail analysis",
    "Title improvement suggestions",
    "Score breakdown by curiosity, emotion, clarity, and more",
  ],
  screenshot: "https://gettitlescore.com/opengraph-image",
  publisher: {
    "@type": "Organization",
    name: "TitleScore",
    url: "https://gettitlescore.com",
  },
};

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "TitleScore — AI YouTube CTR Predictor",
  description:
    "Score your YouTube title and thumbnail before you upload. AI-powered CTR prediction that helps you fix weak spots before they cost you views.",
  metadataBase: new URL("https://gettitlescore.com"),
  alternates: {
    canonical: "https://gettitlescore.com",
  },
  openGraph: {
    title: "TitleScore — AI YouTube CTR Predictor",
    description:
      "Score your YouTube title and thumbnail before you upload. Fix weak spots before they cost you views.",
    url: "https://gettitlescore.com",
    siteName: "TitleScore",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TitleScore — AI YouTube CTR Predictor",
    description:
      "Score your YouTube title and thumbnail before you upload. Fix weak spots before they cost you views.",
  },
  robots: { index: true, follow: true },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:text-white focus:font-semibold"
          style={{ background: "var(--accent-indigo)" }}
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
