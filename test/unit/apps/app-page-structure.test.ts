import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { appLinks } from "@/app/apps/_lib/app-links";
import { discoverAppSlugs, findAppPageStructureProblems } from "./_support/app-page-structure";

const appsDirectory = path.join(process.cwd(), "app", "apps");
const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { force: true, recursive: true });
  }
});

describe("App page structure", () => {
  it("automatically validates every app directory registered in app-links", () => {
    const appSlugs = discoverAppSlugs(appsDirectory);
    const registeredSlugs = appLinks.map(({ slug }) => slug).sort();

    expect(appSlugs).toEqual(registeredSlugs);
    expect(appSlugs.flatMap((slug) => findAppPageStructureProblems(appsDirectory, slug))).toEqual(
      [],
    );
  });

  it("reports missing required routes for a newly added app", () => {
    const fixtureRoot = mkdtempSync(path.join(tmpdir(), "hogedd-app-structure-"));
    temporaryDirectories.push(fixtureRoot);
    const appDirectory = path.join(fixtureRoot, "sample");
    mkdirSync(appDirectory);
    writeFileSync(path.join(appDirectory, "page.tsx"), "export default function Page() {}");

    expect(findAppPageStructureProblems(fixtureRoot, "sample")).toEqual([
      "sample: missing layout route file",
      "sample: missing about route file",
      "sample: missing guide route file",
    ]);
  });

  it("reports pages that bypass the shared shells or use inconsistent metadata", () => {
    const fixtureRoot = mkdtempSync(path.join(tmpdir(), "hogedd-app-structure-"));
    temporaryDirectories.push(fixtureRoot);
    const appDirectory = path.join(fixtureRoot, "sample");
    mkdirSync(path.join(appDirectory, "about"), { recursive: true });
    mkdirSync(path.join(appDirectory, "guide"), { recursive: true });

    writeFileSync(
      path.join(appDirectory, "page.tsx"),
      'createPageMetadata({ path: "/apps/sample" });',
    );
    writeFileSync(path.join(appDirectory, "layout.tsx"), "const layout = <main />;");
    writeFileSync(
      path.join(appDirectory, "about", "page.tsx"),
      'createPageMetadata({ path: "/apps/sample/about" }); const page = <main />;',
    );
    writeFileSync(
      path.join(appDirectory, "guide", "page.tsx"),
      [
        'createPageMetadata({ path: "/apps/wrong-guide" });',
        "const page = (",
        "  <AppGuideShell",
        "    firstSteps={firstSteps}",
        "    basicControls={basicControls}",
        "    screenGuide={screenGuide}",
        "    rules={rules}",
        "  />",
        ");",
      ].join("\n"),
    );

    expect(findAppPageStructureProblems(fixtureRoot, "sample")).toEqual([
      "sample: guide metadata path must be /apps/sample/guide",
      "sample: layout must use AppPageShell",
      "sample: about page must use AppAboutShell",
      "sample: AppGuideShell is missing tips",
    ]);
  });
});
