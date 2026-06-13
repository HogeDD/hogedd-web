import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { JudoRouletteClient } from "@/app/apps/judo-roulette/_components/judo-roulette-client";

export const metadata: Metadata = createPageMetadata({
  title: "柔道ルーレット",
  description: "選択肢を追加して回せる、仕込み可能なルーレット。",
  path: "/apps/judo-roulette",
});

export default function JudoRoulettePage() {
  return (
    <main>
      <JudoRouletteClient />
    </main>
  );
}
