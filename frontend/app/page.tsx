import Link from "next/link";
import type { Metadata } from "next";
import { CopyLinkButton } from "@/app/components/copy-link-button";

export const metadata: Metadata = {
  title: "HogeDD",
  description: "真面目な顔で、くだらないアプリを紹介する HogeDD の公式サイト",
};

const navItems = [
  { href: "#about", label: "About" },
  { href: "#apps", label: "Apps" },
  { href: "#updates", label: "Releases" },
  { href: "#contact", label: "Contact" },
];

const highlights = [
  {
    label: "誠実さ",
    value: "見た目はちゃんとしていて、内側にだけくだらなさを置く。",
  },
  {
    label: "入口",
    value: "トップは `/`、新しいアプリは `/apps/` に積み上げる。",
  },
  {
    label: "見せ方",
    value: "グラデーションは控えめ。軽い動きと余白で見せる。",
  },
];

const releaseNotes = [
  {
    title: "サイトの土台を整理中",
    body: "まずはトップページとアプリ一覧を分けて、今後の拡張に耐える形へ寄せる。",
  },
  {
    title: "最初の公開アプリを準備",
    body: "既存の Clean Tasks を最初のデモアプリとして `/apps/clean-tasks` で見せる。",
  },
  {
    title: "ポートフォリオ化を見据える",
    body: "訪問数、技術ブログ、会社としての見せ方を後から足していく。",
  },
];

const appCards = [
  {
    name: "Clean Tasks",
    description: "Go API とつながる最初のデモアプリ。実験用の土台として使う。",
    href: "/apps/clean-tasks",
    status: "公開中",
  },
  {
    name: "More apps",
    description: "くだらないけれど、見た目はちゃんとしているアプリを今後追加する。",
    href: "/apps",
    status: "準備中",
  },
];

const portfolioSignals = ["訪問者数", "技術ブログ", "会社としてのポートフォリオ"];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <header className="sticky top-3 z-20">
          <div className="rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.88)] px-4 py-3 backdrop-blur-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--accent)] text-sm font-semibold text-white">
                  H
                </span>
                <span className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                    HogeDD
                  </span>
                  <span className="text-sm font-semibold">真面目な顔で、くだらない。</span>
                </span>
              </Link>

              <nav className="flex flex-wrap items-center gap-2 text-sm">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-2.5 py-2 text-[var(--muted)] transition hover:bg-[var(--surface-strong)] hover:text-[var(--foreground)]"
                  >
                    {item.label}
                  </Link>
                ))}
                <CopyLinkButton value="https://www.hogedd.com/" />
              </nav>
            </div>
          </div>
        </header>

        <section className="grid gap-6 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
              public site / `/` first
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                真面目に、くだらない。
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
                HogeDD は、ちょっと変なアプリをちゃんとした顔で紹介する場所です。 最初は toC
                向けのおもしろサイトとして始めて、あとからポートフォリオに育てます。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/apps"
                className="rounded-md bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Appsを見る
              </Link>
              <Link
                href="#about"
                className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-strong)]"
              >
                コンセプト
              </Link>
            </div>
          </div>

          <aside className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {highlights.map((item) => (
              <article
                key={item.label}
                className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  {item.label}
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--foreground)]">{item.value}</p>
              </article>
            ))}
          </aside>
        </section>

        <section id="apps" className="border-t border-[var(--border)] py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                Apps
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                最初のアプリと、これからの置き場
              </h2>
            </div>
            <Link
              href="/apps"
              className="w-fit rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-strong)]"
            >
              一覧へ
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {appCards.map((card) => (
              <Link
                key={card.name}
                href={card.href}
                className="group rounded-md border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                      {card.status}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight">{card.name}</h3>
                  </div>
                  <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] transition group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                    View
                  </span>
                </div>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)]">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="about"
          className="grid gap-6 border-t border-[var(--border)] py-10 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              About
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              誠実な見た目で、くだらなさを見せる
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
              HogeDD は、変なアプリを紹介するためのプラットフォームです。
              直接的すぎないユーモアを使いながら、見た目はちゃんとしていて、説明は誠実に保ちます。
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "mobile first で全端末に対応",
              "グラデーションは控えめ",
              "軽い motion は許可",
              "ロゴは仮置きで進める",
            ].map((item) => (
              <div
                key={item}
                className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="updates" className="border-t border-[var(--border)] py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Releases
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            いま進めていること
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {releaseNotes.map((item) => (
              <article
                key={item.title}
                className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 border-t border-[var(--border)] py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Portfolio
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              将来はポートフォリオとして育てる
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {portfolioSignals.map((signal) => (
              <div
                key={signal}
                className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 text-sm font-medium"
              >
                {signal}
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="border-t border-[var(--border)] py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Contact
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            共有や問い合わせの導線
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://x.com/intent/tweet?text=HogeDD&url=https%3A%2F%2Fwww.hogedd.com%2F"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--surface-strong)]"
            >
              Xで共有
            </a>
            <CopyLinkButton value="https://www.hogedd.com/" />
          </div>
        </section>

        <footer className="border-t border-[var(--border)] py-8 text-sm text-[var(--muted)]">
          Made by HogeDD
        </footer>
      </div>
    </main>
  );
}
