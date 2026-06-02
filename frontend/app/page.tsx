import Link from "next/link";
import type { Metadata } from "next";
import { CopyLinkButton } from "@/app/_components/copy-link-button";
import { HomeAppCarousel } from "@/app/_components/home-app-carousel";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { appLinks } from "@/app/apps/_lib/app-links";

export const metadata: Metadata = {
  title: "HogeDD",
  description: "真面目な顔で、くだらないアプリを紹介する HogeDD の公式サイト",
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
        <section className="grid gap-12 border-b border-[var(--border)] py-16 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:py-24">
          <div className="space-y-10">
            <div className="space-y-4">
              <p className="w-fit rounded-full bg-[var(--highlight)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--foreground)]">
                Portfolio / Contents / Apps
              </p>
              <h1 className="max-w-4xl text-6xl font-semibold leading-[0.92] tracking-tight text-[var(--foreground)] sm:text-7xl lg:text-[5.6rem]">
                <span className="block text-[var(--accent)]">Hoge</span>
                <span className="block">
                  <span className="text-[var(--accent)]">D</span>riven
                </span>
                <span className="block">
                  <span className="text-[var(--accent)]">D</span>evelopment
                </span>
              </h1>
              <p className="max-w-2xl text-2xl leading-9 text-[var(--foreground)]/85 sm:text-[2rem] sm:leading-[2.4rem]">
                きっかけは、なんでもいい。
              </p>
            </div>

            <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg sm:leading-8">
              作りたくなったら、まず作る。HogeDD は、その勢いで生まれたアプリを置いていく場所です。
              完成度よりも、動き出したことを大事にします。
            </p>

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
            <div className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_40px_rgba(20,24,22,0.06)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                    Featured app
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                    {featuredApp?.title ?? "次のアプリ"}
                  </h2>
                </div>
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                  {featuredApp?.status === "published" ? "公開中" : "準備中"}
                </span>
              </div>

              <div className="mt-8 overflow-hidden rounded-[28px] bg-[var(--surface-strong)]">
                {featuredApp?.status === "published" ? (
                  <div
                    className="aspect-[16/10] bg-cover bg-center"
                    aria-label={`${featuredApp.title} の YouTube サムネイル`}
                    style={{ backgroundImage: `url(${featuredApp.thumbnailUrl})` }}
                  />
                ) : (
                  <div className="flex aspect-[16/10] items-end p-6">
                    <div className="max-w-sm space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                        Video pending
                      </p>
                      <p className="text-lg leading-7 text-[var(--foreground)]">
                        ここに YouTube のサムネイルや、あとで差し替える画像が入ります。
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">
                  くだらないきっかけを、ちゃんと触れるものにする。今見せている作品から、 HogeDD
                  の雰囲気がわかります。
                </p>
                <Link
                  href={featuredApp?.appHref ?? "/apps"}
                  className="w-fit rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  作品を見る
                </Link>
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
              HogeDD は、くだらない思いつきや小さな違和感を、実際に触れるものへ変えていく場所です。
              きっかけが弱くても、まず動くものにしてみる。その過程ごと公開していきます。
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
