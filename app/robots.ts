import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/app/_lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
}
