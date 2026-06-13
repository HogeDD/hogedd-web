import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { AppAboutShell } from "@/app/apps/_components/app-about-shell";

export const metadata: Metadata = createPageMetadata({
  title: "About | 柔道ルーレット",
  description: "柔道ルーレットを作ったきっかけ。",
  path: "/apps/judo-roulette/about",
});

// ↓ ここを編集する
const paragraphs = [
  "パリオリンピックの柔道の対戦相手を決定するルーレットが面白いと思った。",
] as const;
// ↑ ここまで

export default function JudoRouletteAboutPage() {
  return <AppAboutShell appName="柔道ルーレット" ddLabel="仕込みDD" paragraphs={paragraphs} />;
}
