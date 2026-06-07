import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { createPageMetadata } from "@/app/_lib/site-metadata";
import type { PublishedAppLink } from "@/app/apps/_lib/app-links";
import { getAllPublishedApps, getAppsPageSections } from "@/app/apps/_lib/apps-page-sections";

export const metadata: Metadata = createPageMetadata({
  title: "Apps",
  description: "HogeDD のアプリ紹介動画リンク集",
  path: "/apps",
});

export default function AppsPage() {
  const sections = getAppsPageSections();
  const allApps = getAllPublishedApps();

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SiteHeader />

      <header className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          className="absolute -right-24 -top-32 h-80 w-80 rounded-full border border-[var(--accent)]/15"
          aria-hidden="true"
        />
        <div
          className="absolute right-24 top-20 h-28 w-28 rounded-full bg-[var(--highlight)]/25"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <h1 className="text-7xl font-semibold tracking-[-0.06em] text-[var(--foreground)] sm:text-8xl">
            Apps
          </h1>
        </div>
      </header>

      {sections.map((section) => (
        <section
          key={section.id}
          className="relative overflow-hidden bg-[var(--accent)] py-20 text-white sm:py-28"
        >
          <div
            className="absolute -left-28 -top-36 h-80 w-80 rounded-full border border-white/15"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-40 right-8 h-80 w-80 rounded-full border border-[var(--highlight)]/30"
            aria-hidden="true"
          />
          <div
            className="absolute left-1/2 top-0 h-px w-80 -translate-x-1/2 bg-white/15"
            aria-hidden="true"
          />

          <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-10 text-3xl font-semibold tracking-tight sm:mb-12 sm:text-4xl">
              {section.label}
            </h2>
            <div className="grid gap-6 sm:grid-cols-[repeat(auto-fill,minmax(18rem,23rem))]">
              {section.apps.map((app) => (
                <AppCard key={app.slug} app={app} size="featured" />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section id="apps" className="relative overflow-hidden">
        <div
          className="absolute -right-20 top-20 h-72 w-72 rounded-full border border-[var(--accent)]/15"
          aria-hidden="true"
        />
        <div
          className="absolute right-10 top-36 h-28 w-28 rounded-full bg-[var(--highlight)]/20 sm:right-[14%]"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 left-10 h-48 w-48 rounded-full border border-[var(--highlight)]/20"
          aria-hidden="true"
        />
        <div
          className="absolute right-[18%] top-32 h-px w-40 bg-[var(--accent)]/15"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <h2 className="mb-10 text-3xl font-semibold tracking-tight sm:mb-12 sm:text-4xl">一覧</h2>

          {allApps.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">公開中のアプリはまだありません。</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {allApps.map((app) => (
                <AppCard key={app.slug} app={app} size="compact" />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SiteFooter />
      </div>
    </main>
  );
}

function AppCard({ app, size }: { app: PublishedAppLink; size: "featured" | "compact" }) {
  const isCompact = size === "compact";

  return (
    <article
      className={[
        "overflow-hidden border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]",
        isCompact
          ? "group rounded-[18px] shadow-[0_6px_18px_rgba(20,24,22,0.06)] transition duration-300 hover:border-[var(--highlight)] hover:shadow-[0_18px_38px_rgba(20,24,22,0.16)] motion-safe:hover:-translate-y-3"
          : "rounded-[24px] shadow-[0_10px_28px_rgba(20,24,22,0.08)]",
      ].join(" ")}
    >
      {isCompact ? (
        <a
          href={app.youtubeUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${app.title} の紹介動画を YouTube で見る`}
          className="block aspect-video border-b border-[var(--border)] bg-cover bg-center transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.035]"
          style={{ backgroundImage: `url(${app.thumbnailUrl})` }}
        />
      ) : (
        <div
          aria-label={`${app.title} の YouTube サムネイル`}
          className="aspect-video border-b border-[var(--border)] bg-cover bg-center"
          style={{ backgroundImage: `url(${app.thumbnailUrl})` }}
        />
      )}

      <div className={["flex flex-col", isCompact ? "px-3 py-2" : "min-h-56 p-5 sm:p-6"].join(" ")}>
        <p
          className={[
            "font-semibold uppercase text-[var(--accent)]",
            isCompact ? "text-[9px] leading-3 tracking-[0.14em]" : "text-xs tracking-[0.2em]",
          ].join(" ")}
        >
          {app.developmentDrive}
        </p>
        <h3
          className={[
            "font-semibold tracking-tight",
            isCompact ? "mt-0.5 text-[15px] leading-5" : "mt-4 text-3xl",
          ].join(" ")}
        >
          {app.title}
        </h3>

        {isCompact ? null : (
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
        )}
      </div>
    </article>
  );
}
