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

export function getAllPublishedApps(
  apps: readonly PublishedAppLink[] = publishedAppLinks,
): readonly PublishedAppLink[] {
  return apps;
}
