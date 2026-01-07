export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/checkout", "/order"],
    },
    sitemap: "https://candy-frontend-taupe.vercel.app/sitemap.xml",
  };
}
