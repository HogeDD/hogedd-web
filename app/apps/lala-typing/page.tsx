import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { TypingGameClient } from "@/app/apps/lala-typing/_components/typing-game-client";

export const metadata: Metadata = createPageMetadata({
  title: "ララ打",
  description: "ラランドの語彙で遊ぶ、ローマ字タイピングゲーム。",
  path: "/apps/lala-typing",
});

export default function LalaTypingPage() {
  return (
    <main>
      <TypingGameClient />
    </main>
  );
}
