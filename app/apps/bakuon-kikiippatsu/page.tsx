import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { BakuonKikiippatsuClient } from "@/app/apps/bakuon-kikiippatsu/_components/bakuon-kikiippatsu-client";

export const metadata: Metadata = createPageMetadata({
  title: "爆音危機一髪",
  description: "1つだけ爆音が鳴るボタンを避けながら、みんなで順番に押していくゲーム。",
  path: "/apps/bakuon-kikiippatsu",
});

export default function BakuonKikiippatsuPage() {
  return (
    <main>
      <BakuonKikiippatsuClient />
    </main>
  );
}
