import type { Metadata } from "next";
import { ChinchinGame } from "@/app/apps/chinchin/_components/chinchin-game";

export const metadata: Metadata = {
  title: "ちんちんゲーム",
  description: "5x5 の盤面で交互に文字を置くローカル2人対戦ゲーム",
};

export default function ChinchinGamePage() {
  return <ChinchinGame />;
}
