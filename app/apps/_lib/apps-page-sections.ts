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

export function getAppsPageSections(): readonly AppsPageSection[] {
  return appsPageSections.flatMap((section) => {
    const apps = section.appSlugs.map((slug) => {
      const app = publishedAppLinks.find((candidate) => candidate.slug === slug);

      if (!app) {
        throw new Error(`Published app not found: ${slug}`);
      }

      return app;
    });

    return apps.length > 0
      ? [
          {
            id: section.id,
            label: section.label,
            apps,
          },
        ]
      : [];
  });
}

export function getAllPublishedApps(): readonly PublishedAppLink[] {
  return publishedAppLinks;
}
