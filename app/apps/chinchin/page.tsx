import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { ChinchinGame } from "@/app/apps/chinchin/_components/chinchin-game";

export const metadata: Metadata = createPageMetadata({
  title: "ちんちんゲーム",
  description: "5x5 の盤面で交互に文字を置くローカル2人対戦ゲーム",
  path: "/apps/chinchin",
});

export default function ChinchinGamePage() {
  return <ChinchinGame />;
}
