import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";

export default function MyPageLoading() {
  return (
    <main className="min-h-screen bg-[var(--background)]" aria-busy="true">
      <SiteHeader />
      <div className="mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-4xl flex-col px-4 sm:px-6 lg:px-8">
        <section className="flex-1 py-20 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Account
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
            マイページ
          </h1>
          <div className="mt-12 border-y border-[var(--border)] py-8">
            <div className="h-4 w-28 animate-pulse bg-[var(--border)]" />
            <div className="mt-4 h-11 w-full max-w-lg animate-pulse bg-[var(--surface)]" />
            <p className="mt-5 text-sm text-[var(--muted)]">アカウント情報を読み込んでいます。</p>
          </div>
        </section>
        <SiteFooter />
      </div>
    </main>
  );
}
