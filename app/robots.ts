import { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://face-run-pokkoris-projects.vercel.app/sitemap.xml",
  };
}
