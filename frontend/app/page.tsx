import Link from "next/link";
import type { Metadata } from "next";
import { CopyLinkButton } from "@/app/_components/copy-link-button";
import { HomeAppCarousel } from "@/app/_components/home-app-carousel";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { appLinks } from "@/app/apps/_lib/app-links";

export const metadata: Metadata = {
  title: "HogeDD",
  description: "欲望と衝動をきっかけに、アプリを作って見せていく HogeDD の公式サイト",
};

const navItems = [
  { href: "#apps", label: "Apps" },
  { href: "#about", label: "About" },
];

const appLinksArray = [...appLinks];
const [featuredApp] = appLinksArray;

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SiteHeader
        title="HogeDD"
        subtitle="Hoge Driven Development"
        navItems={navItems}
        actions={<CopyLinkButton value="https://www.hogedd.com/" label="URLをコピー" />}
      />

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

            <div className="grid max-w-xl gap-3 text-base leading-7 text-[var(--muted)] sm:grid-cols-2">
              <p>その衝動には価値がある。</p>
              <p>理由はそれで十分だ。</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/apps"
                className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Apps を見る
              </Link>
              <Link
                href="#about"
                className="rounded-full border border-transparent px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface)]"
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

              <div className="relative flex min-h-[31rem] flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-4 text-[var(--foreground)]">
                  <p className="max-w-44 text-sm font-semibold leading-6">
                    モテたい。楽をしたい。やってみたい。
                  </p>
                  <span className="rounded-full bg-[var(--foreground)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    impulse
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    {["H", "D", "D"].map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="flex aspect-square items-center justify-center rounded-[28px] bg-white/[0.08] text-5xl font-semibold text-white ring-1 ring-white/10 sm:text-6xl"
                      >
                        {item}
                      </div>
                    ))}
                    <div className="aspect-square overflow-hidden rounded-[28px] bg-white/[0.08] ring-1 ring-white/10">
                      {featuredApp?.status === "published" ? (
                        <div
                          className="h-full bg-cover bg-center"
                          aria-label={`${featuredApp.title} の YouTube サムネイル`}
                          style={{ backgroundImage: `url(${featuredApp.thumbnailUrl})` }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl font-semibold text-white sm:text-6xl">
                          !
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                        Featured app
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                        {featuredApp?.title ?? "次のアプリ"}
                      </h2>
                    </div>
                    <Link
                      href={featuredApp?.appHref ?? "/apps"}
                      className="w-fit rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--highlight)]"
                    >
                      作品を見る
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="apps"
          className="-mx-4 bg-[var(--foreground)] px-4 py-16 text-white sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--highlight)]">
                Apps
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                いま見せている作品
              </h2>
            </div>
            <Link
              href="/apps"
              className="w-fit rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              一覧を見る
            </Link>
          </div>

          <HomeAppCarousel items={appLinksArray} />
        </section>

        <section id="about" className="grid gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              About
            </p>
            <h2 className="max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
              動機は軽くていい。公開まで持っていく。
            </h2>
            <p className="max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
              HogeDD は、衝動や小さな違和感を、実際に触れるものへ変えていく場所です。
              きっかけが個人的でも、まず動くものにしてみる。その過程ごと公開していきます。
            </p>
          </div>

          <div className="grid gap-8 border-l border-[var(--border)] pl-6 sm:grid-cols-3">
            {[
              {
                title: "つくる",
                body: "思いつきを、動くものとして一度外に出す。",
              },
              {
                title: "見せる",
                body: "動画やページで、作ったものにすぐ触れるようにする。",
              },
              {
                title: "続ける",
                body: "小さく直して、次のきっかけにつなげる。",
              },
            ].map((item) => (
              <div key={item.title} className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-[var(--foreground)]">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <SiteFooter
          title="Contact"
          description="共有や問い合わせはここから。必要なら X で見つけてもらい、URL はワンクリックでコピーできるようにしてあります。"
          links={[
            { href: "/apps", label: "Apps" },
            { href: "#about", label: "About" },
          ]}
          actions={
            <>
              <a
                href="https://x.com/intent/tweet?text=HogeDD&url=https%3A%2F%2Fwww.hogedd.com%2F"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-strong)]"
              >
                Xで共有
              </a>
              <CopyLinkButton value="https://www.hogedd.com/" />
            </>
          }
        />
      </div>
    </main>
  );
}
