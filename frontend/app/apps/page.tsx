import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apps",
  description: "HogeDD のアプリ一覧",
};

const publishedApps = [
  {
    name: "Clean Tasks",
    status: "公開中",
    description: "最初のデモアプリ。Go API と BFF の接続を見せるための実験台。",
    href: "/apps/clean-tasks",
  },
];

const comingSoonApps = [
  {
    name: "Next app slot",
    status: "準備中",
    description: "今後、くだらないけれど真面目に見せたいアプリを追加していく場所。",
  },
];

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
              アプリの置き場
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
            `/apps/` は HogeDD の成長面です。新しいアプリはここに積み上げて、
            変な中身をちゃんとした見せ方で並べます。
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {publishedApps.map((app) => (
            <Link
              key={app.name}
              href={app.href}
              className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-white"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                {app.status}
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight">{app.name}</h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{app.description}</p>
            </Link>
          ))}

          {comingSoonApps.map((app) => (
            <div
              key={app.name}
              className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                {app.status}
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight">{app.name}</h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{app.description}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
