import type { Metadata } from "next";
import Link from "next/link";
import type { ManagementUser } from "@/app/_lib/hogedd-api";
import { requireManagementContext } from "@/app/manage/_lib/management-context";

export const metadata: Metadata = {
  title: "運営管理",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ManageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = await requireManagementContext();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex min-h-14 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-baseline gap-3">
            <Link href="/manage" className="font-semibold text-[var(--foreground)]">
              HogeDD
            </Link>
            <span className="text-sm text-[var(--muted)]">Manage</span>
          </div>
          <nav aria-label="運営ナビゲーション" className="flex items-center gap-4 text-sm">
            <Link
              href="/manage/contents"
              className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              コンテンツ
            </Link>
            <Link
              href="/"
              className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              サイト
            </Link>
            <Link
              href="/mypage"
              className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              マイページ
            </Link>
            <a
              href="/auth/logout"
              className="font-medium text-[var(--foreground)] transition hover:text-[var(--accent)]"
            >
              ログアウト
            </a>
          </nav>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100svh-3.5rem)] flex-col">
          <div className="flex items-center justify-between border-b border-[var(--border)] py-4 text-xs text-[var(--muted)]">
            <span>運営管理</span>
            <span>{roleLabel(user.role)}</span>
          </div>
          <main className="flex-1 py-10 sm:py-14">{children}</main>
        </div>
      </div>
    </div>
  );
}

function roleLabel(role: ManagementUser["role"]): string {
  return role === "owner" ? "Owner" : "Admin";
}
