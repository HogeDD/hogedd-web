import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("shared navigation prefetch policy", () => {
  it.each(["app/_components/site-header.tsx", "app/_components/site-footer.tsx"])(
    "disables viewport prefetch in %s",
    (path) => {
      const source = readFileSync(path, "utf8");
      const links = source.match(/<Link\b[\s\S]*?>/g) ?? [];

      expect(links.length).toBeGreaterThan(0);
      expect(links.every((link) => link.includes("prefetch={false}"))).toBe(true);
    },
  );
});
