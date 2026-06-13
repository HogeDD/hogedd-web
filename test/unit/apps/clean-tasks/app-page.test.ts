import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const componentPath = path.join(
  process.cwd(),
  "app",
  "apps",
  "clean-tasks",
  "_components",
  "tasks-client.tsx",
);

describe("Clean Tasks app page", () => {
  it("describes the current TypeScript implementation", async () => {
    const component = await readFile(componentPath, "utf8");

    expect(component).toContain("Next.js + TypeScript");
    expect(component).toContain("backed by a TypeScript use case");
    expect(component).not.toContain("Go API");
  });
});
