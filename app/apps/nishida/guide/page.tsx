import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { AppGuideShell } from "@/app/apps/_components/app-guide-shell";

export const metadata: Metadata = createPageMetadata({
  title: "Guide | ニシ打",
  description: "ラランド・ニシダにまつわる語彙で遊ぶ、ローマ字タイピングゲーム。",
  path: "/apps/nishida/guide",
});

// ↓ ここを編集する
const firstSteps = [
  "PCは日本語入力(IME)をオフにする。スマホ・タブレットは準備不要",
  "スタートボタンを押すか、Enterキーで開始する",
  "表示された単語をローマ字で入力する",
] as const;

const basicControls = [
  "PC: aからzと「-」のキーで入力し、Escで中断する",
  "スマホ・タブレット: 画面下に出るキーをタップして入力し、「中断」で戻る",
  "Enter: スタート / もう一度",
] as const;

const screenGuide = [
  "大きな文字がお題、その下の行がひらがなの読み",
  "ローマ字の行は、打った部分が濃い色、残りが薄い色で表示される",
  "WORDが進み具合、MISSがミスした回数",
] as const;

const rules = [
  "「し」= shi / si のように、一般的なローマ字の揺れはどれでも正解",
  "「ん」は次の文字によっては n を2回打つ(画面の薄い文字に従えば確実)",
  "全8問を打ち終えると、速さと正確さでS〜Dのランクが決まる",
] as const;

const tips = [
  "PCでキーを打っても反応しないときは、日本語入力(IME)がオンになっていないか確認する",
] as const;
// ↑ ここまで

export default function NishidaGuidePage() {
  return (
    <AppGuideShell
      appName="ニシ打"
      firstSteps={firstSteps}
      basicControls={basicControls}
      screenGuide={screenGuide}
      rules={rules}
      tips={tips}
    />
  );
}
