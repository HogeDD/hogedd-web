import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("shared navigation prefetch policy", () => {
  it("prefetches only the My Page loading boundary in the header", () => {
    const source = readFileSync("app/_components/site-header.tsx", "utf8");
    expect(source).toContain('prefetch={item.href === "/mypage" ? null : false}');
    expect(source).not.toContain('href="/apps" prefetch');
  });

  it("disables viewport prefetch in the footer", () => {
    const source = readFileSync("app/_components/site-footer.tsx", "utf8");
    const links = source.match(/<Link\b[\s\S]*?>/g) ?? [];
    expect(links.length).toBeGreaterThan(0);
    expect(links.every((link) => link.includes("prefetch={false}"))).toBe(true);
  });
});
