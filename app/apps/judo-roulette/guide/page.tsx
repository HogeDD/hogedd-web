import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { AppGuideShell } from "@/app/apps/_components/app-guide-shell";

export const metadata: Metadata = createPageMetadata({
  title: "Guide | 柔道ルーレット",
  description: "柔道ルーレットの選択肢追加、仕込み、回し方。",
  path: "/apps/judo-roulette/guide",
});

// ↓ ここを編集する
const firstSteps = [
  "選択肢の入力欄へ名前を入れて追加する",
  "「柔道ルーレット」のタイトルを約1秒長押しする",
  "仕込み先を選び、「回す」を押す",
] as const;

const basicControls = [
  "追加: 入力した内容をルーレットへ加える",
  "削除: 不要な選択肢をルーレットから外す",
  "回す: ルーレットを回転させる",
] as const;

const screenGuide = [
  "三角形の印がルーレットの停止位置を示す",
  "回転が止まると、選ばれた内容がルーレットの下に表示される",
] as const;

const rules = [
  "選択肢は2個以上、12個まで追加できる",
  "一度仕込んだ選択肢は、別の選択肢を仕込むまで何度回しても選ばれる",
  "仕込み先を削除した場合は、残っている先頭の選択肢へ切り替わる",
] as const;

const tips = ["仕込み画面が開かないときは、タイトルを動かさずに少し長めに押し続ける"] as const;
// ↑ ここまで

export default function JudoRouletteGuidePage() {
  return (
    <AppGuideShell
      appName="柔道ルーレット"
      firstSteps={firstSteps}
      basicControls={basicControls}
      screenGuide={screenGuide}
      rules={rules}
      tips={tips}
    />
  );
}
