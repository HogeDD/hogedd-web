import type { Metadata } from "next";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { AppAboutShell } from "@/app/apps/_components/app-about-shell";

export const metadata: Metadata = createPageMetadata({
  title: "About | ちんちんゲーム",
  description: "ちんちんゲームをアプリにしたきっかけと、こどおじDDについて。",
  path: "/apps/chinchin/about",
});

// ↓ ここを編集する
const paragraphs = [
  "「地元の進学校の男子高校生が、駅のホームでやっていて楽しそうなゲームでした。」そんなメールとともに、このゲームは紹介されました。",
  "TBSラジオで月曜24時から放送中の「空気階段の踊り場」。番組内のコーナー「孤独なおじさん、いざゆかん」にて紹介されたこのゲームを、私は遊びたくなりました。",
  "高校生も、このゲームを紙に書いて遊んでいたことでしょう。アプリで遊びたくないか？ 暇な大人が作っておいたぞ！",
] as const;

const referenceLinks = [
  {
    label: "空気階段の踊り場",
    href: "https://www.tbsradio.jp/odoriba/",
    description: "このゲームが紹介された、TBSラジオの番組。",
  },
  {
    label: "孤独なおじさん、いざゆかん",
    href: "https://www.amazon.co.jp/dp/4591188159",
    description: "番組内の同名コーナーから生まれた書籍。",
  },
] as const;
// ↑ ここまで

export default function ChinchinAboutPage() {
  return (
    <AppAboutShell
      appName="ちんちんゲーム"
      ddLabel="こどおじDD"
      paragraphs={paragraphs}
      referenceLinks={referenceLinks}
    />
  );
}
