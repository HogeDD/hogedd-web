import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchManagementApps } from "@/app/_lib/hogedd-api";
import { CreateAppForm } from "@/app/manage/contents/_components/create-app-form";
import { requireManagementContext } from "@/app/manage/_lib/management-context";

export default async function ManageContentsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; created?: string }>;
}) {
  const { apiBaseURL, accessToken } = await requireManagementContext();
  const result = await fetchManagementApps(apiBaseURL, accessToken);
  if (result.kind === "not_found") notFound();
  const params = await searchParams;

  return (
    <div>
      <p className="text-xs font-semibold text-[var(--accent)]">Management</p>
      <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
        コンテンツ管理
      </h1>

      {params.created ? (
        <p role="status" className="mt-6 text-sm font-medium text-emerald-700">
          {params.created} を登録しました。
        </p>
      ) : null}
      {params.error ? (
        <p role="alert" className="mt-6 text-sm font-medium text-red-700">
          {errorMessage(params.error)}
        </p>
      ) : null}

      <section className="mt-12" aria-labelledby="create-app">
        <h2 id="create-app" className="text-lg font-semibold text-[var(--foreground)]">
          新しいアプリ
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">公開準備中のコンテンツとして登録します。</p>
        <div className="mt-5">
          <CreateAppForm />
        </div>
      </section>

      <section className="mt-14" aria-labelledby="apps-list">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="apps-list" className="text-lg font-semibold text-[var(--foreground)]">
            コンテンツ
          </h2>
          <span className="text-sm text-[var(--muted)]">
            {result.kind === "ok" ? result.apps.length : 0}件
          </span>
        </div>
        {result.kind !== "ok" ? (
          <p className="mt-5 border-y border-[var(--border)] py-6 text-sm text-red-700">
            一覧を取得できませんでした。
          </p>
        ) : result.apps.length === 0 ? (
          <p className="mt-5 border-y border-[var(--border)] py-8 text-sm text-[var(--muted)]">
            登録されたコンテンツはありません。
          </p>
        ) : (
          <div className="mt-5 border-t border-[var(--border)]">
            {result.apps.map((app) => (
              <Link
                key={app.slug}
                href={`/manage/contents/${app.slug}`}
                className="grid gap-2 border-b border-[var(--border)] py-5 sm:grid-cols-[minmax(0,1fr)_10rem_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="font-medium text-[var(--foreground)]">{app.title}</p>
                  <p className="mt-1 break-all text-sm text-[var(--muted)]">/{app.slug}</p>
                </div>
                <p className="truncate text-sm text-[var(--muted)]">
                  {app.tags.join(", ") || "タグなし"}
                </p>
                <span className="text-xs font-semibold text-[var(--muted)]">
                  {app.status === "preparing" ? "準備中" : "公開中"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function errorMessage(error: string): string {
  if (error === "conflict") return "同じSlugのアプリが既にあります。";
  if (error === "invalid") return "入力内容を確認してください。";
  return "処理できませんでした。時間をおいて再度お試しください。";
}
