export type AppPageId = "app" | "about" | "guide";

type AppPageNavigationItem = {
  id: AppPageId;
  label: string;
  getHref: (appHref: string) => string;
};

export const appPageNavigationItems: readonly AppPageNavigationItem[] = [
  {
    id: "app",
    label: "App",
    getHref: (appHref) => appHref,
  },
  {
    id: "about",
    label: "About",
    getHref: (appHref) => `${appHref}/about`,
  },
  {
    id: "guide",
    label: "Guide",
    getHref: (appHref) => `${appHref}/guide`,
  },
];

export function getActiveAppPage(pathname: string, appHref: string): AppPageId {
  if (pathname === `${appHref}/about`) {
    return "about";
  }

  if (pathname === `${appHref}/guide`) {
    return "guide";
  }

  return "app";
}
