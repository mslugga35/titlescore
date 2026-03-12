import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://gettitlescore.com",
      lastModified: "2026-03-12",
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
