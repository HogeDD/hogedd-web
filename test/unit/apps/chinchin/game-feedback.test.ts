import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const gameComponentPath = path.join(
  process.cwd(),
  "app",
  "apps",
  "chinchin",
  "_components",
  "chinchin-game.tsx",
);
const globalStylesPath = path.join(process.cwd(), "app", "globals.css");

describe("Chinchin game feedback", () => {
  it("announces state changes and offers another game after the result", async () => {
    const gameComponent = await readFile(gameComponentPath, "utf8");

    expect(gameComponent).toContain('aria-live="polite"');
    expect(gameComponent).toContain("もう一度");
    expect(gameComponent).toContain("status.type !==");
  });

  it("keeps movement optional for reduced-motion users", async () => {
    const [gameComponent, globalStyles] = await Promise.all([
      readFile(gameComponentPath, "utf8"),
      readFile(globalStylesPath, "utf8"),
    ]);

    expect(gameComponent).toContain("motion-safe:animate-[chinchin-mark-in");
    expect(gameComponent).toContain("motion-safe:animate-[chinchin-status-in");
    expect(gameComponent).toContain("motion-safe:animate-[chinchin-win");
    expect(gameComponent).toContain("select-none blur-sm");
    expect(globalStyles).toContain("@keyframes chinchin-mark-in");
    expect(globalStyles).toContain("@keyframes chinchin-status-in");
    expect(globalStyles).toContain("@keyframes chinchin-win");
  });
});
