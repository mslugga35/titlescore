import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
