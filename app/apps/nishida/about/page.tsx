import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { AppAboutShell } from "@/app/apps/_components/app-about-shell";
import { appLinks } from "@/app/apps/_lib/app-links";

export const metadata: Metadata = createPageMetadata({
  title: "About | ニシ打",
  description: "ラランド・ニシダにまつわる語彙で遊ぶ、ローマ字タイピングゲーム。",
  path: "/apps/nishida/about",
});

// ↓ ここを編集する
const paragraphs = [
  "「サーヤとスタッフで悪口寿司打作ってニシダにやってほしい」",
  "エグいコメントだった。",
  "自分で悪口をチンタラ打つも地獄。相方に高速で悪口を打たれるのも地獄。でもみたい。だから作った。",
] as const;

const referenceLinks = [
  {
    label: "ニシ打のきっかけになったYouTube動画",
    href: "https://www.youtube.com/watch?v=LL5yvuJzVOk",
    description:
      "「サーヤとスタッフで悪口寿司打作ってニシダにやってほしい」というコメントが寄せられた動画。",
  },
] as const;
// ↑ ここまで

const appLink = appLinks.find((a) => a.slug === "nishida");

export default function NishidaAboutPage() {
  return (
    <AppAboutShell
      appName="ニシ打"
      ddLabel="コメントDD"
      paragraphs={paragraphs}
      youtubeUrl={appLink?.status === "published" ? appLink.youtubeUrl : undefined}
      youtubeThumbnailUrl={appLink?.status === "published" ? appLink.thumbnailUrl : undefined}
      referenceLinks={referenceLinks}
    />
  );
}
