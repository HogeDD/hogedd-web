import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { AppAboutShell } from "@/app/apps/_components/app-about-shell";

export const metadata: Metadata = createPageMetadata({
  title: "About | 爆音危機一髪",
  description: "爆音危機一髪を作ったきっかけと、遊び方の空気。",
  path: "/apps/bakuon-kikiippatsu/about",
});

// ↓ ここを編集する
const paragraphs = [
  "鳴っちゃいけない音が爆音で鳴るって面白くないですか？",
  "でも、自分が鳴らすのは嫌じゃないですか？誰かにならして欲しいですよね？かと言って押し付けるのも違いますよね？ランダムで器用じゃないですか！",
  "人数を選ぶ。音量を上げる。1人ずつ押す。鳴った人が負け。これだけ。",
  "絶対に授業中にやらないでください。",
  "絶対に授業中にやらないでください。",
  "絶対にじゅg",
] as const;

const referenceLinks = [
  {
    label: "黒ひげ危機一発",
    href: "https://www.amazon.co.jp/%E3%82%BF%E3%82%AB%E3%83%A9%E3%83%88%E3%83%9F%E3%83%BC-TAKARA-TOMY-%E9%BB%92%E3%81%B2%E3%81%92%E5%8D%B1%E6%A9%9F%E4%B8%80%E7%99%BA-NEW%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8/dp/B004KKX9FE",
    description: "いつ飛び出すか分からない緊張感を、スマホで囲んで遊ぶ爆音ボタンへ置き換えた。",
  },
  {
    label: "おなら",
    href: "https://ja.wikipedia.org/wiki/%E5%B1%81",
    description: "鳴ってはいけない音として参考にした。",
  },
] as const;
// ↑ ここまで

export default function BakuonKikiippatsuAboutPage() {
  return (
    <AppAboutShell
      appName="爆音危機一髪"
      ddLabel="爆音DD"
      paragraphs={paragraphs}
      referenceLinks={referenceLinks}
    />
  );
}
