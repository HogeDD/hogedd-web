import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { TypingGameClient } from "@/app/apps/nishida/_components/typing-game-client";

export const metadata: Metadata = createPageMetadata({
  title: "ニシ打",
  description: "ラランド・ニシダにまつわる語彙で遊ぶ、ローマ字タイピングゲーム。",
  path: "/apps/nishida",
});

export default function NishidaPage() {
  return (
    <main>
      <TypingGameClient />
    </main>
  );
}
