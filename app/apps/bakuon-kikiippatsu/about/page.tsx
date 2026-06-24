import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { AppAboutShell } from "@/app/apps/_components/app-about-shell";

export const metadata: Metadata = createPageMetadata({
  title: "About | 爆音危機一髪",
  description: "爆音危機一髪を作ったきっかけ。",
  path: "/apps/bakuon-kikiippatsu/about",
});

// ↓ ここを編集する
const paragraphs = ["鳴っちゃいけない音が爆音で鳴るって面白くないですか？特に学生の時。"] as const;

const referenceLinks = [
  {
    label: "Pop-Up Pirate",
    href: "https://en.wikipedia.org/wiki/Pop-up_Pirate",
    description: "黒ひげ危機一発の英題。ボタン版の危機一髪として発想した。",
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
