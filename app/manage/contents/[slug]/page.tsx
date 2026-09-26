import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchManagementApp } from "@/app/_lib/hogedd-api";
import { requireManagementContext } from "@/app/manage/_lib/management-context";
import { EditAppForm } from "@/app/manage/contents/[slug]/_components/edit-app-form";
import {
  MakePrivateForm,
  PublishAppForm,
} from "@/app/manage/contents/[slug]/_components/publish-app-form";

export default async function ManageContentPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; saved?: string; published?: string }>;
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
          {result.app.status === "preparing"
            ? "準備中"
            : result.app.status === "private"
              ? "非公開"
              : "公開中"}
        </span>
      </div>
      {query.saved ? (
        <p role="status" className="mt-6 text-sm font-medium text-emerald-700">
          保存しました。
        </p>
      ) : null}
      {query.published ? (
        <p role="status" className="mt-6 text-sm font-medium text-emerald-700">
          公開しました。
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
      {result.app.status === "preparing" || result.app.status === "private" ? (
        <section className="mt-14" aria-labelledby="publish-app">
          <h2 id="publish-app" className="text-lg font-semibold">
            {result.app.status === "private" ? "再公開" : "公開"}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            公開するとHogeDDの公開一覧に表示されます。
          </p>
          <div className="mt-5">
            <PublishAppForm app={result.app} />
          </div>
        </section>
      ) : (
        <section
          className="mt-14 border-t border-[var(--border)] pt-6"
          aria-labelledby="published-info"
        >
          <h2 id="published-info" className="text-lg font-semibold">
            公開情報
          </h2>
          <dl className="mt-5 grid gap-3 text-sm">
            <div>
              <dt className="text-[var(--muted)]">開発動機</dt>
              <dd className="mt-1">{result.app.development_drive}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">YouTube</dt>
              <dd className="mt-1 break-all">
                <a
                  href={result.app.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent)]"
                >
                  {result.app.youtube_url}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">公開日時</dt>
              <dd className="mt-1">{result.app.published_at}</dd>
            </div>
          </dl>
          <div className="mt-6">
            <MakePrivateForm app={result.app} />
          </div>
        </section>
      )}
    </div>
  );
}

function errorMessage(error: string): string {
  if (error === "conflict")
    return "別の更新がありました。最新情報を読み込んで、もう一度編集してください。";
  if (error === "invalid") return "入力内容を確認してください。";
  return "保存できませんでした。時間をおいて再度お試しください。";
}
