import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next", "/api", "/auth"],
      },
    ],
    sitemap: "https://blog-master-alpha.vercel.app/sitemap.xml",
  };
}
