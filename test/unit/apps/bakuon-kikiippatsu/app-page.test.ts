import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getPlayerIconRows } from "@/app/apps/bakuon-kikiippatsu/_components/bakuon-kikiippatsu-client";

const appDirectory = path.join(process.cwd(), "app", "apps", "bakuon-kikiippatsu");

describe("bakuon kikiippatsu app page", () => {
  it("uses the sumi theme", () => {
    const layoutSource = readFileSync(path.join(appDirectory, "layout.tsx"), "utf8");

    expect(layoutSource).toContain("theme={appThemePresets.sumi}");
  });

  it("keeps the first screen copy minimal", () => {
    const clientSource = readFileSync(
      path.join(appDirectory, "_components", "bakuon-kikiippatsu-client.tsx"),
      "utf8",
    );

    expect(clientSource).not.toContain(
      "1つだけ爆音が鳴るボタンがあります。順番は自分たちで決めて、1人ずつ押してください。",
    );
    expect(clientSource).not.toContain("Status");
    expect(clientSource).not.toContain("人数を選んで、音量を上げてから開始");
    expect(clientSource).not.toContain("音量MAXにしましたか？");
    expect(clientSource).not.toContain(
      "端末の音量を上げてから始めてください。消音モードだと台無しです。",
    );
    expect(clientSource).not.toContain(">MAX<");
    expect(clientSource).toContain("プレイヤー人数選択");
    expect(clientSource).toContain("音量を上げる");
    expect(clientSource).toContain("READY");
    expect(clientSource).toContain("PlayerCountRollSelector");
    expect(clientSource).not.toContain("PlayerCountButton");
    expect(clientSource).toContain("SAFE 残り");
    expect(clientSource).not.toContain("playSafeClick");
    expect(clientSource).toContain("REVEAL_DURATION_MS");
  });

  it("splits player icons into the requested rows", () => {
    expect(getPlayerIconRows(2).map((row) => row.length)).toEqual([2]);
    expect(getPlayerIconRows(3).map((row) => row.length)).toEqual([3]);
    expect(getPlayerIconRows(4).map((row) => row.length)).toEqual([4]);
    expect(getPlayerIconRows(5).map((row) => row.length)).toEqual([3, 2]);
    expect(getPlayerIconRows(6).map((row) => row.length)).toEqual([3, 3]);
    expect(getPlayerIconRows(7).map((row) => row.length)).toEqual([4, 3]);
    expect(getPlayerIconRows(8).map((row) => row.length)).toEqual([4, 4]);
    expect(getPlayerIconRows(9).map((row) => row.length)).toEqual([5, 4]);
    expect(getPlayerIconRows(10).map((row) => row.length)).toEqual([5, 5]);
  });
});
