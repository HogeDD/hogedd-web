import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { auth0 } from "@/app/_lib/auth0";
import { fetchCurrentUserProfile } from "@/app/_lib/hogedd-api";
import { saveInitialProfile } from "@/app/setup/actions";

export const metadata: Metadata = {
  title: "初回設定",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SetupPageProps = { searchParams: Promise<{ error?: string }> };

export default async function SetupPage({ searchParams }: SetupPageProps) {
  if (!auth0 || !process.env.HOGEDD_API_BASE_URL) return <SetupUnavailable />;
  const session = await auth0.getSession();
  if (!session) redirect("/login");

  let accessToken: string;
  try {
    ({ token: accessToken } = await auth0.getAccessToken());
  } catch {
    redirect("/login");
  }

  const profile = await fetchCurrentUserProfile(process.env.HOGEDD_API_BASE_URL, accessToken);
  if (profile.kind === "ok") redirect("/mypage");
  if (profile.kind === "unauthorized") redirect("/login");
  if (profile.kind !== "user_not_found" && profile.kind !== "profile_not_found") {
    return <SetupUnavailable />;
  }
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SiteHeader />
      <div className="mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-4xl flex-col px-4 sm:px-6 lg:px-8">
        <section className="flex-1 py-20 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Account Setup
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
            はじめまして
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)]">
            HogeDDで表示する名前を設定します。あとからマイページで変更できます。
          </p>

          <form action={saveInitialProfile} className="mt-12 border-y border-[var(--border)] py-8">
            <label
              htmlFor="display_name"
              className="block text-sm font-semibold text-[var(--foreground)]"
            >
              表示名
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              required
              maxLength={50}
              autoComplete="nickname"
              autoFocus
              className="mt-3 min-h-12 w-full max-w-lg border border-[var(--border)] bg-white px-4 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
            />
            <p className="mt-2 text-sm text-[var(--muted)]">1〜50文字</p>
            {error ? (
              <p role="alert" className="mt-4 text-sm font-medium text-red-700">
                {error === "invalid"
                  ? "表示名を1〜50文字で入力してください。"
                  : "保存できませんでした。時間をおいて、もう一度お試しください。"}
              </p>
            ) : null}
            <button
              type="submit"
              className="mt-7 inline-flex min-h-11 items-center justify-center bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--foreground)]"
            >
              設定を完了
            </button>
          </form>
        </section>
        <SiteFooter />
      </div>
    </main>
  );
}

function SetupUnavailable() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-24 text-center text-[var(--foreground)]">
      <h1 className="text-2xl font-semibold">初回設定を利用できません</h1>
      <p className="mt-4 text-[var(--muted)]">時間をおいて、もう一度お試しください。</p>
    </main>
  );
}
