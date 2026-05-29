import Link from "next/link";
import type { Metadata } from "next";
import { appLinks } from "@/app/apps/_lib/app-links";

export const metadata: Metadata = {
  title: "Apps",
  description: "HogeDD のアプリ紹介動画リンク集",
};

export default function AppsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              /apps
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              アプリ紹介動画
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium transition hover:bg-[var(--surface-strong)]"
          >
            Home
          </Link>
        </header>

        <section className="py-8">
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
            YouTube で紹介したアプリをここに並べます。概要欄から戻ってきた人が、
            動画とアプリ本体をすぐ行き来できる場所です。
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {appLinks.length === 0 ? (
            <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                準備中
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight">最初の動画を準備中</h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                公開したアプリ紹介動画から順に、このページへ追加していきます。
              </p>
            </div>
          ) : (
            appLinks.map((app) => (
              <article
                key={app.slug}
                className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]"
              >
                <div
                  aria-label={`${app.title} の YouTube サムネイル`}
                  className="aspect-video border-b border-[var(--border)] bg-[var(--surface-strong)] bg-cover bg-center"
                  style={{ backgroundImage: `url(${app.thumbnailUrl})` }}
                />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    {app.publishedAt}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold tracking-tight">{app.title}</h2>
                  <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{app.description}</p>

                  {app.tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {app.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={app.appHref}
                      className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      アプリを見る
                    </Link>
                    <a
                      href={app.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-strong)]"
                    >
                      YouTube
                    </a>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
