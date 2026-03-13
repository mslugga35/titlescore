import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: "https://gettitlescore.com",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
