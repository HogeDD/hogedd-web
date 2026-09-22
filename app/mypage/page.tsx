import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { auth0 } from "@/app/_lib/auth0";
import { fetchCurrentUser, type RegisteredUser } from "@/app/_lib/hogedd-api";
import { presentUser } from "@/app/mypage/_lib/user-presentation";

export const metadata: Metadata = {
  title: "マイページ",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MyPage() {
  const user = await loadCurrentUser();

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SiteHeader />
      <div className="mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-4xl flex-col px-4 sm:px-6 lg:px-8">
        <section className="flex-1 py-20 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Account
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
            マイページ
          </h1>

          {user.kind === "ok" ? (
            <AccountDetails user={user.user} />
          ) : (
            <AccountUnavailable kind={user.kind} />
          )}
        </section>
        <SiteFooter />
      </div>
    </main>
  );
}

async function loadCurrentUser(): Promise<
  { kind: "ok"; user: RegisteredUser } | { kind: "not_found" } | { kind: "unavailable" }
> {
  if (!auth0 || !process.env.HOGEDD_API_BASE_URL) {
    return { kind: "unavailable" };
  }
  const session = await auth0.getSession();
  if (!session) redirect("/login");

  let accessToken: string;
  try {
    ({ token: accessToken } = await auth0.getAccessToken());
  } catch {
    redirect("/login");
  }

  const result = await fetchCurrentUser(process.env.HOGEDD_API_BASE_URL, accessToken);
  if (result.kind === "unauthorized") redirect("/login");
  return result.kind === "ok" ? result : { kind: result.kind };
}

function AccountDetails({ user }: { user: RegisteredUser }) {
  const presented = presentUser(user);
  const details = [
    ["メールアドレス", presented.email],
    ["メール確認", presented.emailVerification],
    ["権限", presented.role],
    ["アカウント状態", presented.status],
    ["登録日", presented.registeredAt],
  ];

  return (
    <div className="mt-12 border-t border-[var(--border)]">
      <dl>
        {details.map(([label, value]) => (
          <div
            key={label}
            className="grid gap-2 border-b border-[var(--border)] py-5 sm:grid-cols-[10rem_1fr] sm:items-center"
          >
            <dt className="text-sm font-medium text-[var(--muted)]">{label}</dt>
            <dd className="min-w-0 break-words text-base font-medium text-[var(--foreground)]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <a
        href="/auth/logout"
        className="mt-8 inline-flex min-h-11 items-center justify-center border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--foreground)] hover:bg-[var(--surface)]"
      >
        ログアウト
      </a>
    </div>
  );
}

function AccountUnavailable({ kind }: { kind: "not_found" | "unavailable" }) {
  return (
    <div className="mt-12 border-y border-[var(--border)] py-8">
      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        {kind === "not_found" ? "利用登録が完了していません" : "アカウント情報を取得できません"}
      </h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
        {kind === "not_found"
          ? "初回設定を完了すると、アカウント情報を確認できます。"
          : "時間をおいて、もう一度お試しください。"}
      </p>
      {kind === "not_found" ? (
        <a
          href="/setup"
          className="mt-6 inline-flex min-h-11 items-center justify-center bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--foreground)]"
        >
          初回設定へ
        </a>
      ) : null}
    </div>
  );
}
