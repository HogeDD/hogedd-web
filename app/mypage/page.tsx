import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { auth0 } from "@/app/_lib/auth0";
import {
  fetchCurrentUser,
  fetchCurrentUserProfile,
  type RegisteredUser,
  type UserProfile,
} from "@/app/_lib/hogedd-api";
import { updateDisplayName } from "@/app/mypage/actions";
import { presentUser } from "@/app/mypage/_lib/user-presentation";

export const metadata: Metadata = {
  title: "マイページ",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type MyPageProps = { searchParams: Promise<{ error?: string; updated?: string }> };

export default async function MyPage({ searchParams }: MyPageProps) {
  const user = await loadCurrentUser();
  const notice = await searchParams;

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
            <AccountDetails user={user.user} profile={user.profile} notice={notice} />
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
  | { kind: "ok"; user: RegisteredUser; profile: UserProfile }
  | { kind: "not_found" }
  | { kind: "unavailable" }
> {
  if (!auth0 || !process.env.HOGEDD_API_BASE_URL) {
    return { kind: "unavailable" };
  }
  let accessToken: string;
  try {
    ({ token: accessToken } = await auth0.getAccessToken());
  } catch {
    redirect("/login");
  }

  const [result, profile] = await Promise.all([
    fetchCurrentUser(process.env.HOGEDD_API_BASE_URL, accessToken),
    fetchCurrentUserProfile(process.env.HOGEDD_API_BASE_URL, accessToken),
  ]);
  if (result.kind === "unauthorized") redirect("/login");
  if (result.kind !== "ok") return { kind: result.kind };

  if (profile.kind === "unauthorized") redirect("/login");
  if (profile.kind === "profile_not_found") redirect("/setup");
  if (profile.kind !== "ok") return { kind: "unavailable" };
  return { kind: "ok", user: result.user, profile: profile.profile };
}

function AccountDetails({
  user,
  profile,
  notice,
}: {
  user: RegisteredUser;
  profile: UserProfile;
  notice: { error?: string; updated?: string };
}) {
  const presented = presentUser(user);
  const details = [
    ["メールアドレス", presented.email],
    ["メール確認", presented.emailVerification],
    ["権限", presented.role],
    ["アカウント状態", presented.status],
    ["登録日", presented.registeredAt],
  ];

  return (
    <div className="mt-12">
      <form action={updateDisplayName} className="border-y border-[var(--border)] py-7">
        <label
          htmlFor="display_name"
          className="block text-sm font-semibold text-[var(--foreground)]"
        >
          表示名
        </label>
        <div className="mt-3 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <input
            id="display_name"
            name="display_name"
            type="text"
            required
            maxLength={50}
            autoComplete="nickname"
            defaultValue={profile.display_name}
            className="min-h-11 min-w-0 flex-1 border border-[var(--border)] bg-white px-4 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
          />
          <button
            type="submit"
            className="inline-flex min-h-11 shrink-0 items-center justify-center bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--foreground)]"
          >
            変更を保存
          </button>
        </div>
        {notice.updated ? (
          <p role="status" className="mt-3 text-sm font-medium text-emerald-700">
            表示名を更新しました。
          </p>
        ) : null}
        {notice.error ? (
          <p role="alert" className="mt-3 text-sm font-medium text-red-700">
            {notice.error === "invalid"
              ? "表示名を1〜50文字で入力してください。"
              : "更新できませんでした。時間をおいて、もう一度お試しください。"}
          </p>
        ) : null}
      </form>
      <div className="mt-10 border-t border-[var(--border)]">
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
