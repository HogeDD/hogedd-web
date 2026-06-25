import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { AppGuideShell } from "@/app/apps/_components/app-guide-shell";

export const metadata: Metadata = createPageMetadata({
  title: "Guide | 爆音危機一髪",
  description: "爆音危機一髪を複数人で遊ぶための準備、操作、ルール。",
  path: "/apps/bakuon-kikiippatsu/guide",
});

// ↓ ここを編集する
const firstSteps = [
  "遊ぶ人数を2人から10人の間で選ぶ",
  "端末の音量を上げる。消音モードやブラウザの音声許可も先に確認する",
  "開始したら、みんなで同じ画面を囲み、順番を決めて1人ずつボタンを押す",
] as const;

const basicControls = [
  "プレイヤー人数選択: 人数表示を操作して、2人から10人まで選べる",
  "音量を上げる: 開始前に端末側の音量確認を促すためのボタン",
  "開始: 人数に応じた数のボタンを用意して、爆音ボタンを1つだけ仕込む",
  "やり直し: 爆音が鳴った後や途中で、人数選択から始め直せる",
] as const;

const screenGuide = [
  "中央に並ぶ大きなボタンが押す場所。セーフだったボタンは暗くなり、もう押せなくなる",
  "画面上の人数表示は、何人で遊ぶかを決めるためのもの。誰の番かはアプリでは管理しない",
  "爆音ボタンを押すと画面が赤くなり、押した人が負けとして表示される",
] as const;

const rules = [
  "爆音ボタンは毎回1つだけランダムに決まる",
  "押す順番はプレイヤー同士で決める。時計回りでも、じゃんけん順でもよい",
  "セーフだったボタンは再度押せない。残ったボタンの中から次の人が選ぶ",
  "爆音が鳴ったボタンを押した人が負け。鳴るまで続ける",
] as const;

const tips = [
  "音が出ないときは、端末の音量、消音モード、ブラウザの音声許可を確認する",
  "最初の1回は小さめの音量で試してから、本番の音量に上げると安心",
  "順番でもめそうなときは、画面を囲んで時計回りに押すと分かりやすい",
] as const;
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
