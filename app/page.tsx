import Link from "next/link";
import type { Metadata } from "next";
import { HeroImpulsePanel } from "@/app/_components/hero-impulse-panel";
import { HomeAppCarousel } from "@/app/_components/home-app-carousel";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { createPageMetadata, siteDescription, siteName } from "@/app/_lib/site-metadata";
import { publishedAppLinks } from "@/app/apps/_lib/app-links";

export const metadata: Metadata = createPageMetadata({
  title: siteName,
  description: siteDescription,
  path: "/",
  absoluteTitle: true,
});

const appLinksArray = [...publishedAppLinks];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SiteHeader />

      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <section className="grid min-h-[calc(100svh-5.5rem)] gap-12 border-b border-[var(--border)] py-14 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:py-16">
          <div className="space-y-9">
            <div className="space-y-5">
              <p className="w-fit rounded-full bg-[var(--highlight)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground)]">
                HogeDD
              </p>
              <h1 className="max-w-4xl text-6xl font-semibold leading-[0.88] tracking-tight text-[var(--foreground)] sm:text-7xl lg:text-[6.4rem]">
                <span className="block">Hoge</span>
                <span className="block">
                  <span className="text-[var(--accent)]">D</span>riven
                </span>
                <span className="block">
                  <span className="text-[var(--accent)]">D</span>evelopment
                </span>
              </h1>
              <p className="max-w-2xl text-2xl leading-9 text-[var(--foreground)]/85 sm:text-[2.3rem] sm:leading-[2.75rem]">
                人は欲望によって進歩する。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/apps"
                className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[var(--foreground)] hover:shadow-md motion-safe:hover:-translate-y-0.5"
              >
                Apps を見る
              </Link>
              <Link
                href="#about"
                className="rounded-full border border-transparent px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition duration-200 hover:border-[var(--border)] hover:bg-[var(--surface)] hover:shadow-sm motion-safe:hover:-translate-y-0.5"
              >
                HogeDD について
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[40px] bg-[var(--foreground)] p-5 text-white shadow-[0_24px_60px_rgba(20,24,22,0.16)] sm:p-7">
              <div
                className="absolute inset-x-0 top-0 h-28 bg-[var(--highlight)]"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-8 right-8 h-28 w-28 rounded-full border border-white/20"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full border border-white/10"
                aria-hidden="true"
              />

              <div className="relative min-h-[31rem]">
                <HeroImpulsePanel />
              </div>
            </div>
          </div>
        </section>

        <section
          id="apps"
          className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[var(--accent)] px-4 py-28 text-white sm:px-6 sm:py-32 lg:px-8 lg:py-36"
        >
          <div className="relative mx-auto max-w-6xl">
            <div
              className="absolute -right-36 -top-36 h-80 w-80 rounded-full border border-white/10"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-32 left-2 h-64 w-64 rounded-full border border-[var(--highlight)]/25"
              aria-hidden="true"
            />
            <div
              className="absolute left-1/2 top-4 h-px w-64 -translate-x-1/2 bg-white/10"
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--highlight)]">
                  Apps
                </p>
                <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  公開中のアプリ
                </h2>
              </div>
              <Link
                href="/apps"
                className="w-fit rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:border-[var(--highlight)] hover:bg-[var(--highlight)] hover:text-[var(--foreground)] hover:shadow-md motion-safe:hover:-translate-y-0.5"
              >
                一覧を見る
              </Link>
            </div>

            <HomeAppCarousel items={appLinksArray} />
          </div>
        </section>

        <section id="about" className="py-32 sm:py-40">
          <div className="space-y-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              About
            </p>
            <div className="flex flex-wrap items-baseline justify-center gap-x-6 gap-y-5 border-y border-[var(--border)] py-10 text-center">
              {[
                { text: "モテたい。", size: "text-4xl sm:text-6xl", opacity: "opacity-100" },
                { text: "暇を潰したい。", size: "text-3xl sm:text-5xl", opacity: "opacity-85" },
                { text: "驚かせたい。", size: "text-4xl sm:text-6xl", opacity: "opacity-95" },
                { text: "笑わせたい。", size: "text-3xl sm:text-5xl", opacity: "opacity-90" },
                { text: "自慢したい。", size: "text-2xl sm:text-4xl", opacity: "opacity-80" },
                { text: "助けたい。", size: "text-3xl sm:text-5xl", opacity: "opacity-95" },
                {
                  text: "好奇心を満たしたい。",
                  size: "text-2xl sm:text-4xl",
                  opacity: "opacity-85",
                },
                { text: "忘れたくない。", size: "text-3xl sm:text-5xl", opacity: "opacity-90" },
                { text: "愛したい。", size: "text-2xl sm:text-4xl", opacity: "opacity-80" },
                { text: "神になりたい。", size: "text-4xl sm:text-6xl", opacity: "opacity-100" },
                { text: "推しを布教したい。", size: "text-3xl sm:text-5xl", opacity: "opacity-85" },
                { text: "なんとなく。", size: "text-2xl sm:text-4xl", opacity: "opacity-90" },
              ].map((item, index) => (
                <span
                  key={item.text}
                  className={`${item.size} ${item.opacity} font-semibold leading-none tracking-tight ${
                    index % 3 === 1 ? "text-[var(--accent)]" : "text-[var(--foreground)]"
                  }`}
                >
                  {item.text}
                </span>
              ))}
            </div>
            <div className="flex flex-col items-center gap-6 text-center">
              <p className="text-5xl font-semibold tracking-tight text-[var(--accent)] sm:text-7xl">
                <span>理由はそれで</span>
                <br className="sm:hidden" />
                <span>十分だ。</span>
              </p>
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="h-2 w-10 bg-[var(--highlight)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--foreground)]/35" />
              </div>
            </div>
          </div>
        </section>
        <SiteFooter />
      </div>
    </main>
  );
}
