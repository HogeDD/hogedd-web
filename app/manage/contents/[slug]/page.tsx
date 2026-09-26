import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchManagementApp } from "@/app/_lib/hogedd-api";
import { requireManagementContext } from "@/app/manage/_lib/management-context";
import { EditAppForm } from "@/app/manage/contents/[slug]/_components/edit-app-form";

export default async function ManageContentPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { slug } = await params;
  const { apiBaseURL, accessToken } = await requireManagementContext();
  const result = await fetchManagementApp(apiBaseURL, accessToken, slug);
  if (result.kind === "not_found") notFound();
  const query = await searchParams;
  if (result.kind !== "ok")
    return (
      <p role="alert" className="text-sm text-red-700">
        詳細を取得できませんでした。
      </p>
    );
  return (
    <div>
      <Link
        href="/manage/contents"
        className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
      >
        ← コンテンツ一覧
      </Link>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[var(--accent)]">/{result.app.slug}</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{result.app.title}</h1>
        </div>
        <span className="text-xs font-semibold text-[var(--muted)]">
          {result.app.status === "preparing" ? "準備中" : "公開中"}
        </span>
      </div>
      {query.saved ? (
        <p role="status" className="mt-6 text-sm font-medium text-emerald-700">
          保存しました。
        </p>
      ) : null}
      {query.error ? (
        <p role="alert" className="mt-6 text-sm font-medium text-red-700">
          {errorMessage(query.error)}
        </p>
      ) : null}
      <section className="mt-12" aria-labelledby="edit-app">
        <h2 id="edit-app" className="text-lg font-semibold">
          基本情報
        </h2>
        <div className="mt-5">
          <EditAppForm app={result.app} />
        </div>
      </section>
    </div>
  );
}

function errorMessage(error: string): string {
  if (error === "conflict")
    return "別の更新がありました。最新情報を読み込んで、もう一度編集してください。";
  if (error === "invalid") return "入力内容を確認してください。";
  return "保存できませんでした。時間をおいて再度お試しください。";
}
