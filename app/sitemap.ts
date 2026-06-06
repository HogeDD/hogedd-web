import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/app/_lib/site-metadata";

const routes = ["/", "/apps", "/apps/clean-tasks", "/apps/chinchin"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: getAbsoluteUrl(route),
  }));
}
