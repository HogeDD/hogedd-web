import { publishedAppLinks, type PublishedAppLink } from "@/app/apps/_lib/app-links";

type AppsPageSectionConfig = {
  id: string;
  label: string;
  appSlugs: readonly string[];
};

export type AppsPageSection = Omit<AppsPageSectionConfig, "appSlugs"> & {
  apps: readonly PublishedAppLink[];
};

export const appsPageSections: readonly AppsPageSectionConfig[] = [
  {
    id: "recommended",
    label: "おすすめ",
    appSlugs: ["clean-tasks"],
  },
];

export function getAppsPageSections(
  recommendedApps: readonly PublishedAppLink[] = publishedAppLinks.filter(
    (app) => app.slug === "clean-tasks",
  ),
): readonly AppsPageSection[] {
  return recommendedApps.length > 0
    ? [{ id: "recommended", label: "おすすめ", apps: recommendedApps }]
    : [];
}

export function createRankedAppsPageSections(ranked: {
  latest?: PublishedAppLink;
  popular?: PublishedAppLink;
  trending?: PublishedAppLink;
}): readonly AppsPageSection[] {
  return [
    { id: "latest", label: "最新", apps: ranked.latest ? [ranked.latest] : [] },
    { id: "popular", label: "人気", apps: ranked.popular ? [ranked.popular] : [] },
    { id: "trending", label: "急上昇", apps: ranked.trending ? [ranked.trending] : [] },
  ].filter((section) => section.apps.length > 0);
}

export function getAllPublishedApps(
  apps: readonly PublishedAppLink[] = publishedAppLinks,
): readonly PublishedAppLink[] {
  return apps;
}
