import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { AppAboutShell } from "@/app/apps/_components/app-about-shell";
import { appLinks } from "@/app/apps/_lib/app-links";

export const metadata: Metadata = createPageMetadata({
  title: "About | ララ打",
  description: "ラランドの語彙で遊ぶ、ローマ字タイピングゲーム。",
  path: "/apps/lala-typing/about",
});

// ↓ ここを編集する(制作経緯は本人の言葉で書く。以下は仮置き)
const paragraphs = [
  "(ここに、ララ打を作った理由を自分の言葉で書く。)",
  "(なぜラランドなのか、どんな場面で遊んでほしいのかを書く。)",
] as const;
// ↑ ここまで

const appLink = appLinks.find((a) => a.slug === "lala-typing");

export default function LalaTypingAboutPage() {
  return (
    <AppAboutShell
      appName="ララ打"
      ddLabel="推しDD"
      paragraphs={paragraphs}
      youtubeUrl={appLink?.status === "published" ? appLink.youtubeUrl : undefined}
      youtubeThumbnailUrl={appLink?.status === "published" ? appLink.thumbnailUrl : undefined}
    />
  );
}
