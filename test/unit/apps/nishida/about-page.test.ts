import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const aboutPagePath = path.join(process.cwd(), "app", "apps", "nishida", "about", "page.tsx");
const gameClientPath = path.join(
  process.cwd(),
  "app",
  "apps",
  "nishida",
  "_components",
  "typing-game-client.tsx",
);

describe("Nishida about page", () => {
  it("keeps the confirmed source YouTube reference", async () => {
    const aboutPage = await readFile(aboutPagePath, "utf8");

    expect(aboutPage).toContain('ddLabel="コメントDD"');
    expect(aboutPage).toContain("https://www.youtube.com/watch?v=LL5yvuJzVOk");
    expect(aboutPage).toContain('label: "タイピングできないニシダ"');
    expect(aboutPage).toContain(
      "「サーヤとスタッフで悪口寿司打作ってニシダにやってほしい」というコメントが寄せられた動画。",
    );
    expect(aboutPage).toContain("referenceLinks={referenceLinks}");
  });

  it("uses LALANDE as the start screen label", async () => {
    const gameClient = await readFile(gameClientPath, "utf8");

    expect(gameClient).toContain("LALANDE");
    expect(gameClient).not.toContain(">Ready<");
  });
});
