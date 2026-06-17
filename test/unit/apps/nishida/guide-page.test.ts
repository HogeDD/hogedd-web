import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const guidePagePath = path.join(process.cwd(), "app", "apps", "nishida", "guide", "page.tsx");

describe("Nishida guide page", () => {
  it("keeps the confirmed gameplay guidance without the removed noisy tip", async () => {
    const guidePage = await readFile(guidePagePath, "utf8");

    expect(guidePage).toContain("<AppGuideShell");
    expect(guidePage).toContain("tips={tips}");
    expect(guidePage).toContain("PCでキーを打っても反応しないときは、日本語入力");
    expect(guidePage).not.toContain("ランクDでも大丈夫。漫才と同じで、タイピングも場数。");
  });
});
