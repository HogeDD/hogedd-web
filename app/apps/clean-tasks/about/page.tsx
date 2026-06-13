import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { AppAboutShell } from "@/app/apps/_components/app-about-shell";
import { appLinks } from "@/app/apps/_lib/app-links";

export const metadata: Metadata = createPageMetadata({
  title: "About | Clean Tasks",
  description: "Clean Architecture の練習として作った、最小構成のタスクアプリ。",
  path: "/apps/clean-tasks/about",
});

// ↓ ここを編集する
const paragraphs = [
  "Clean Architecture という本がある。読んだ。正直、最初は意味がわからなかった。usecase？port？依存の方向？「それ、ファイルを増やしたいだけじゃないの？」と思った。",
  "だから作った。頭で理解するより、手を動かすほうが早いと知っているから。タスクを追加して、完了して、消える。それだけのアプリ。でもそのシンプルさの裏側に、ちゃんとレイヤーが分かれている。",
  "作り終えたとき、少しだけ分かった気がした。「なるほど、これがやりたかったのか」と。それで十分だった。",
] as const;

const referenceLinks = [
  {
    label: "Clean Architecture（Robert C. Martin）",
    href: "https://www.amazon.co.jp/dp/4048930656",
    description:
      "この本を読んで作った。usecase、port、依存の方向——最初は全部ピンとこなかったけど、手を動かしたら少し分かった。",
  },
] as const;
// ↑ ここまで

const appLink = appLinks.find((a) => a.slug === "clean-tasks");

export default function CleanTasksAboutPage() {
  return (
    <AppAboutShell
      appName="Clean Tasks"
      ddLabel="学習DD"
      paragraphs={paragraphs}
      youtubeUrl={appLink?.status === "published" ? appLink.youtubeUrl : undefined}
      youtubeThumbnailUrl={appLink?.status === "published" ? appLink.thumbnailUrl : undefined}
      referenceLinks={referenceLinks}
    />
  );
}
