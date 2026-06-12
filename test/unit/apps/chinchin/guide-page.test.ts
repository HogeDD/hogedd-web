import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const appDirectory = path.join(process.cwd(), "app", "apps", "chinchin");

describe("Chinchin guide page", () => {
  it("uses the shared Guide shell and enables all app pages", async () => {
    const [guidePage, layout] = await Promise.all([
      readFile(path.join(appDirectory, "guide", "page.tsx"), "utf8"),
      readFile(path.join(appDirectory, "layout.tsx"), "utf8"),
    ]);

    expect(guidePage).toContain("<AppGuideShell");
    expect(guidePage).toContain("firstSteps={firstSteps}");
    expect(guidePage).toContain("basicControls={basicControls}");
    expect(guidePage).toContain("screenGuide={screenGuide}");
    expect(guidePage).toContain("rules={rules}");
    expect(guidePage).toContain("ruleExample={<WinningExamples />}");
    expect(guidePage).toContain("tips={tips}");
    expect(layout).toContain('availablePages={["app", "about", "guide"]}');
  });
});
