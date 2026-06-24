import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { AppGuideShell } from "@/app/apps/_components/app-guide-shell";

export const metadata: Metadata = createPageMetadata({
  title: "Guide | 爆音危機一髪",
  description: "爆音危機一髪の遊び方とルール。",
  path: "/apps/bakuon-kikiippatsu/guide",
});

// ↓ ここを編集する
const firstSteps = [
  "遊ぶ人数を選ぶ",
  "端末の音量を上げて、みんなで同じ画面を囲む",
  "開始したら、1人ずつ好きなボタンを押す",
] as const;

const basicControls = [
  "人数ボタン: 2人から8人まで選べる",
  "開始: 人数×3個のボタンを用意して、爆音ボタンを1つだけ仕込む",
  "やり直し: いつでも人数選択から始め直せる",
] as const;

const screenGuide = [
  "中央の大きなボタン群が押す場所。セーフだったボタンは暗くなり、もう押せない",
  "爆音ボタンを押すと画面が赤くなり、押した人の負けが表示される",
] as const;

const rules = [
  "爆音ボタンは毎回1つだけランダムに決まる",
  "誰の番かはアプリでは管理しない。人間側で順番に押す",
  "爆音が鳴ったボタンを押した人が負け",
] as const;

const tips = ["音が出ないときは、端末の消音モードやブラウザの音声許可を確認する"] as const;
// ↑ ここまで

export default function BakuonKikiippatsuGuidePage() {
  return (
    <AppGuideShell
      appName="爆音危機一髪"
      firstSteps={firstSteps}
      basicControls={basicControls}
      screenGuide={screenGuide}
      rules={rules}
      tips={tips}
    />
  );
}
