// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://candy-frontend-taupe.vercel.app";

  return [
    { url: baseUrl, lastModified: new Date() },     // 메인
    { url: `${baseUrl}/recipe`, lastModified: new Date() }, // 레시피 목록
    // ❌ productList는 지금 넣지 않는다
  ];
}