export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/checkout", "/order"],
    },
    sitemap: "https://your-domain.com/sitemap.xml",
  };
}
