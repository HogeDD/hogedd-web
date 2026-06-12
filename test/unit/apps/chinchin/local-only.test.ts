import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const appDirectory = path.join(process.cwd(), "app", "apps", "chinchin");

describe("Chinchin local game", () => {
  it("does not include online match UI, state, or routes", async () => {
    const gameComponent = await readFile(
      path.join(appDirectory, "_components", "chinchin-game.tsx"),
      "utf8",
    );

    expect(gameComponent).not.toMatch(/online|ランダム対戦|ローカルへ戻る|Match:/i);
    expect(existsSync(path.join(appDirectory, "_lib", "online-matches.ts"))).toBe(false);
    expect(existsSync(path.join(appDirectory, "api", "matches", "random", "route.ts"))).toBe(false);
    expect(existsSync(path.join(appDirectory, "api", "matches", "[matchId]", "route.ts"))).toBe(
      false,
    );
    expect(
      existsSync(path.join(appDirectory, "api", "matches", "[matchId]", "moves", "route.ts")),
    ).toBe(false);
  });
});
