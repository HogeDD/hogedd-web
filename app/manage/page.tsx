import Link from "next/link";

export default function ManagePage() {
  return (
    <div>
      <p className="text-xs font-semibold text-[var(--accent)]">Management</p>
      <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">運営管理</h1>
      <section className="mt-12" aria-labelledby="management-sections">
        <h2 id="management-sections" className="text-sm font-semibold text-[var(--foreground)]">
          管理領域
        </h2>
        <div className="mt-4 border-t border-[var(--border)]">
          <Link
            href="/manage/contents"
            className="grid gap-2 border-b border-[var(--border)] py-5 transition hover:text-[var(--accent)] sm:grid-cols-[12rem_1fr_auto] sm:items-center"
          >
            <span className="font-medium">コンテンツ</span>
            <span className="text-sm text-[var(--muted)]">アプリの登録・編集・公開</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
