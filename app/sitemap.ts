import type { MetadataRoute } from "next";

export const dynamic = "force-static";

import { getAllSlugs } from "@/lib/writings";
import { getAllPresentationSlugs } from "@/lib/presentations";

const siteUrl = "https://rajnavakoti.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const writingSlugs = getAllSlugs();
  const presentationSlugs = getAllPresentationSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/writings`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/publications`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/presentations`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const writingPages: MetadataRoute.Sitemap = writingSlugs.map((slug) => ({
    url: `${siteUrl}/writings/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const presentationPages: MetadataRoute.Sitemap = presentationSlugs.map(
    (slug) => ({
      url: `${siteUrl}/presentations/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  return [...staticPages, ...writingPages, ...presentationPages];
}
