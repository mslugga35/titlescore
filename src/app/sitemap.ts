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
    {
      url: "https://gettitlescore.com/blog",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://gettitlescore.com/blog/youtube-title-tips",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
