import { describe, expect, it } from "vitest";
import { publishedAppLinks } from "@/app/apps/_lib/app-links";

describe("app links", () => {
  it("stores the development drive for each app", () => {
    expect(publishedAppLinks.find(({ slug }) => slug === "clean-tasks")?.developmentDrive).toBe(
      "学習DD",
    );
  });

  it("only exposes apps with a published video", () => {
    expect(publishedAppLinks.map(({ slug }) => slug)).toEqual(["clean-tasks"]);
  });
});
