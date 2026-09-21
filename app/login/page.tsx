import type { Metadata } from "next";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { auth0 } from "@/app/_lib/auth0";

export const metadata: Metadata = {
  title: "ログイン",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const session = await auth0.getSession();

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SiteHeader />

      <div className="mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-4xl flex-col px-4 sm:px-6 lg:px-8">
        <section className="flex flex-1 items-center py-20 sm:py-28">
          <div className="w-full border-y border-[var(--border)] py-12 sm:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Account
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
              {session ? "ログイン中" : "ログイン"}
            </h1>

            {session ? (
              <div className="mt-8 flex flex-col items-start gap-5">
                <p className="text-base text-[var(--muted)]">
                  {session.user.email ?? "認証済みアカウント"}
                </p>
                <a
                  href="/auth/logout"
                  className="inline-flex min-h-11 items-center justify-center border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--foreground)] hover:bg-[var(--surface)]"
                >
                  ログアウト
                </a>
              </div>
            ) : (
              <a
                href="/auth/login"
                className="mt-8 inline-flex min-h-11 items-center justify-center bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--foreground)]"
              >
                Auth0でログイン
              </a>
            )}
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
