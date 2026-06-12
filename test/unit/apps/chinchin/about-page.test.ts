import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const appDirectory = path.join(process.cwd(), "app", "apps", "chinchin");

describe("Chinchin about page", () => {
  it("uses the shared About shell and enables the About navigation", async () => {
    const [aboutPage, layout] = await Promise.all([
      readFile(path.join(appDirectory, "about", "page.tsx"), "utf8"),
      readFile(path.join(appDirectory, "layout.tsx"), "utf8"),
    ]);

    expect(aboutPage).toContain("<AppAboutShell");
    expect(aboutPage).toContain('ddLabel="こどおじDD"');
    expect(layout).toContain('availablePages={["app", "about"]}');
  });
});
