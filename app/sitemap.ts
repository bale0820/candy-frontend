// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://candy-frontend-taupe.vercel.app";

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/product`, lastModified: new Date() },
    { url: `${baseUrl}/recipe`, lastModified: new Date() },
  ];
}