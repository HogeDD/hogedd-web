import { existsSync, readdirSync } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const appsDirectory = path.join(process.cwd(), "app", "apps");

describe("App page layouts", () => {
  it("requires every app page to define the shared site layout", async () => {
    const appDirectories = readdirSync(appsDirectory, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
      .map((entry) => entry.name);

    const appPages = appDirectories.filter((appName) => {
      return existsSync(path.join(appsDirectory, appName, "page.tsx"));
    });

    const missingLayouts = (
      await Promise.all(
        appPages.map(async (appName) => {
          const layoutPath = path.join(appsDirectory, appName, "layout.tsx");

          try {
            await access(layoutPath);
            return null;
          } catch {
            return appName;
          }
        }),
      )
    ).filter((appName): appName is string => appName !== null);

    expect(missingLayouts).toEqual([]);
  });
});
