import Link from "next/link";
import type { Metadata } from "next";
import { CopyLinkButton } from "@/app/_components/copy-link-button";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { appLinks } from "@/app/apps/_lib/app-links";

export const metadata: Metadata = {
  title: "Apps",
  description: "HogeDD のアプリ紹介動画リンク集",
};

export default function AppsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <SiteHeader
          title="HogeDD"
          subtitle="アプリ紹介動画"
          navItems={[
            { href: "/", label: "Home" },
            { href: "#apps", label: "Apps" },
          ]}
          actions={<CopyLinkButton value="https://www.hogedd.com/apps" label="URLをコピー" />}
        />

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
              公開前のものは準備中として置き、増えるたびに自然に積み上がる設計です。
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_10px_24px_rgba(20,24,22,0.04)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                管理方針
              </p>
              <h2 className="mt-3 text-lg font-semibold tracking-tight">動画を足すだけで増える</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                `app-links.ts` に 1 件追加すると、一覧と個別ページの入口が揃います。
              </p>
            </article>

            <article className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_10px_24px_rgba(20,24,22,0.04)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                次の拡張
              </p>
              <h2 className="mt-3 text-lg font-semibold tracking-tight">
                将来は DB に差し替え可能
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                いまは静的データで十分。更新頻度が上がったら後で持ち方を変えます。
              </p>
            </article>
          </div>
        </section>

        <section id="apps" className="grid gap-6 md:grid-cols-2">
          {appLinks.length === 0 ? (
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
            appLinks.map((app) => (
              <article
                key={app.slug}
                className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_10px_28px_rgba(20,24,22,0.04)]"
              >
                {app.status === "published" ? (
                  <div
                    aria-label={`${app.title} の YouTube サムネイル`}
                    className="aspect-[16/10] border-b border-[var(--border)] bg-cover bg-center"
                    style={{ backgroundImage: `url(${app.thumbnailUrl})` }}
                  />
                ) : (
                  <div className="flex aspect-[16/10] items-end border-b border-[var(--border)] bg-[linear-gradient(135deg,rgba(23,63,52,0.12),rgba(23,63,52,0.02))] p-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                        動画準備中
                      </p>
                      <p className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                        {app.title}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                      {app.status === "published" ? "公開中" : "準備中"}
                    </span>
                    <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                      {app.publishedAt}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-semibold tracking-tight">{app.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                    {app.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {app.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-medium text-[var(--muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={app.appHref}
                      className="rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      アプリを見る
                    </Link>
                    {app.status === "published" ? (
                      <>
                        <a
                          href={app.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-strong)]"
                        >
                          YouTube
                        </a>
                        <a
                          href={app.xShareUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${app.title} の YouTube リンクを X で共有`}
                          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-strong)]"
                        >
                          Xで共有
                        </a>
                      </>
                    ) : null}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        <SiteFooter
          title="Apps"
          description="このページは動画の一覧であり、アプリの入口でもあります。公開中のものは YouTube と本体を、準備中のものはこれからの追加を見せる場所です。"
          links={[
            { href: "/", label: "Home" },
            { href: "#apps", label: "Apps" },
          ]}
          actions={<CopyLinkButton value="https://www.hogedd.com/apps" />}
        />
      </div>
    </main>
  );
}
