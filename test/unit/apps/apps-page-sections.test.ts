import { describe, expect, it } from "vitest";
import { appsPageSections, getAllPublishedApps } from "@/app/apps/_lib/apps-page-sections";

describe("Apps page sections", () => {
  it("keeps curated app placement in one configuration", () => {
    expect(appsPageSections).toEqual([
      {
        id: "recommended",
        label: "おすすめ",
        appSlugs: ["clean-tasks"],
      },
    ]);
  });

  it("exposes every published app for the full list", () => {
    expect(getAllPublishedApps().map(({ slug }) => slug)).toEqual(["clean-tasks"]);
  });
});
