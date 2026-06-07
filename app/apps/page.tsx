import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import { publishedAppLinks } from "@/app/apps/_lib/app-links";

export const metadata: Metadata = createPageMetadata({
  title: "Apps",
  description: "HogeDD のアプリ紹介動画リンク集",
  path: "/apps",
});

export default function AppsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <SiteHeader />

        <section className="grid gap-6 py-14 lg:grid-cols-[1fr_0.95fr] lg:items-end lg:py-16">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              /apps
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
              アプリ紹介動画の棚
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
              YouTube で紹介したアプリを、動画と本体を往復しやすい形で並べています。
              気になったものを見つけたら、そのまま触って遊べます。
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_10px_24px_rgba(20,24,22,0.04)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Watch
              </p>
              <h2 className="mt-3 text-lg font-semibold tracking-tight">動画で雰囲気を見る</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                何を作ったのか、まずは短い紹介動画から確認できます。
              </p>
            </article>

            <article className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_10px_24px_rgba(20,24,22,0.04)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Play
              </p>
              <h2 className="mt-3 text-lg font-semibold tracking-tight">そのまま触ってみる</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                気になったらアプリ本体へ。動画と作品を行き来できます。
              </p>
            </article>
          </div>
        </section>

        <section id="apps" className="grid gap-6 md:grid-cols-2">
          {publishedAppLinks.length === 0 ? (
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_8px_24px_rgba(20,24,22,0.03)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                準備中
              </p>
              <h2 className="mt-3 text-xl font-semibold tracking-tight">最初の動画を準備中</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                公開したアプリ紹介動画から順に、このページへ追加していきます。
              </p>
            </div>
          ) : (
            publishedAppLinks.map((app) => (
              <article
                key={app.slug}
                className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_10px_28px_rgba(20,24,22,0.04)]"
              >
                <div
                  aria-label={`${app.title} の YouTube サムネイル`}
                  className="aspect-video border-b border-[var(--border)] bg-cover bg-center"
                  style={{ backgroundImage: `url(${app.thumbnailUrl})` }}
                />

                <div className="flex min-h-56 flex-col p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                    {app.developmentDrive}
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight">{app.title}</h2>

                  <div className="mt-auto flex flex-wrap gap-3 pt-10">
                    <Link
                      href={app.appHref}
                      className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--foreground)]"
                    >
                      アプリを見る
                    </Link>
                    <a
                      href={app.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-strong)]"
                    >
                      YouTube
                    </a>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
