import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  defineAppLink,
  definePreparingAppLink,
  publishedAppLinks,
} from "@/app/apps/_lib/app-links";
import { findPublishedAppMetadataProblems } from "./_support/published-app-metadata";

const appsDirectory = path.join(process.cwd(), "app", "apps");
const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { force: true, recursive: true });
  }
});

describe("Published app metadata", () => {
  it.runIf(process.env.REQUIRE_PUBLISHED_APP_METADATA === "true")(
    "requires every published app to have complete release metadata and app sharing images",
    () => {
      expect(
        publishedAppLinks.flatMap((app) => findPublishedAppMetadataProblems(appsDirectory, app)),
      ).toEqual([]);
    },
  );

  it("reports missing or invalid release files", () => {
    const fixtureRoot = mkdtempSync(path.join(tmpdir(), "hogedd-published-app-"));
    temporaryDirectories.push(fixtureRoot);
    const appDirectory = path.join(fixtureRoot, "sample");
    mkdirSync(appDirectory);
    writeFileSync(path.join(appDirectory, "opengraph-image.png"), "not a PNG");
    writeFileSync(path.join(appDirectory, "opengraph-image.alt.txt"), "");
    writeFileSync(path.join(appDirectory, "twitter-image.png"), "not a PNG");
    writeFileSync(path.join(appDirectory, "twitter-image.alt.txt"), "");

    const app = defineAppLink("https://youtu.be/abc1234", {
      slug: "sample",
      title: "Sample",
      description: "Sample app",
      appHref: "/apps/wrong",
      publishedAt: "動画準備中",
      developmentDrive: "Test DD",
    });

    expect(findPublishedAppMetadataProblems(fixtureRoot, app)).toEqual([
      "sample: appHref must be /apps/sample",
      "sample: publishedAt must use YYYY-MM-DD",
      "sample: opengraph-image.png must be 1200x630 PNG",
      "sample: opengraph-image.alt.txt must not be empty",
      "sample: twitter-image.png must be 1200x630 PNG",
      "sample: twitter-image.alt.txt must not be empty",
    ]);
  });

  it("does not apply publication requirements to preparing apps", () => {
    const app = definePreparingAppLink({
      slug: "sample",
      title: "Sample",
      description: "Sample app",
      appHref: "/apps/sample",
      publishedAt: "動画準備中",
    });

    expect(app.status).toBe("preparing");
    expect(publishedAppLinks).not.toContain(app);
  });
});
