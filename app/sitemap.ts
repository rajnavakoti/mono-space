import type { MetadataRoute } from "next";

export const dynamic = "force-static";

import { getAllSlugs } from "@/lib/blog";
import { getAllPresentationSlugs } from "@/lib/presentations";

const siteUrl = "https://rajnavakoti.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getAllSlugs();
  const presentationSlugs = getAllPresentationSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/presentations`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${siteUrl}/blog/${slug}`,
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

  return [...staticPages, ...blogPages, ...presentationPages];
}
