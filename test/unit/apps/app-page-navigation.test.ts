import { describe, expect, it } from "vitest";
import { appPageNavigationItems, getActiveAppPage } from "@/app/apps/_lib/app-page-navigation";

describe("App page navigation", () => {
  it("builds the shared App, About, and Guide routes", () => {
    expect(
      appPageNavigationItems.map((item) => ({
        id: item.id,
        label: item.label,
        href: item.getHref("/apps/example"),
      })),
    ).toEqual([
      { id: "app", label: "App", href: "/apps/example" },
      { id: "about", label: "About", href: "/apps/example/about" },
      { id: "guide", label: "Guide", href: "/apps/example/guide" },
    ]);
  });

  it.each([
    ["/apps/example", "app"],
    ["/apps/example/about", "about"],
    ["/apps/example/guide", "guide"],
  ] as const)("selects %s as %s", (pathname, expectedPage) => {
    expect(getActiveAppPage(pathname, "/apps/example")).toBe(expectedPage);
  });
});
